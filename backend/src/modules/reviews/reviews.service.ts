import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model, Types } from 'mongoose';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import { Review, ReviewDocument } from '../../database/schemas/review.schema';
import { Service, ServiceDocument } from '../../database/schemas/service.schema';
import { BookingStatus, UserRole } from '../../common/enums';
import { toRecord } from '../../database/schemas/schema.helpers';
import { round2 } from '../../common/utils/money.util';
import { TransactionService } from '../../database/transaction.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import {
  buildPaginationMeta,
  clampPagination,
  Paginated,
} from '../../common/utils/pagination';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

const EDIT_WINDOW_MS = 48 * 60 * 60 * 1000; // 48 hours

type ReviewRecord = Record<string, unknown> & { id: string };

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    private readonly config: ConfigService,
    private readonly tx: TransactionService,
  ) {}

  /** Whether a completed booking is required before a customer can review. */
  private get requireCompletedBooking(): boolean {
    return (process.env.REVIEWS_REQUIRE_BOOKING ?? 'true') !== 'false';
  }

  /**
   * Resolves a path param that may be a service slug OR an ObjectId into the
   * service's `_id`. Returns null if no matching service exists.
   */
  private async resolveServiceId(slugOrId: string): Promise<Types.ObjectId | null> {
    const or: FilterQuery<ServiceDocument>[] = [{ slug: slugOrId }];
    if (Types.ObjectId.isValid(slugOrId)) or.push({ _id: new Types.ObjectId(slugOrId) });
    const svc = await this.serviceModel
      .findOne({ $or: or, deletedAt: null })
      .select({ _id: 1 })
      .lean()
      .exec();
    return svc?._id ?? null;
  }

  /** Public, paginated list of published reviews for a service (by slug or id). */
  async listForService(slugOrId: string, query: PaginationQueryDto): Promise<Paginated<unknown>> {
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const serviceId = await this.resolveServiceId(slugOrId);
    if (!serviceId) {
      // Unknown service → empty page (the reviews endpoint is public/forgiving).
      return { data: [], meta: buildPaginationMeta(0, page, limit) };
    }
    const where: FilterQuery<ReviewDocument> = { serviceId, isPublished: true };

    const [data, total] = await Promise.all([
      this.reviewModel
        .find(where)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(take)
        .populate('authorId', 'name profileUrl')
        .lean()
        .exec(),
      this.reviewModel.countDocuments(where).exec(),
    ]);
    return {
      data: data.map((r) => toRecord(r as never)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  /**
   * Creates a review. Requires a COMPLETED booking for the service (unless
   * disabled by config). One review per author per service. Recomputes the
   * service's cached rating/reviewCount in the same transaction.
   */
  async create(user: AuthUser, slugOrId: string, dto: CreateReviewDto): Promise<ReviewRecord> {
    const resolved = await this.resolveServiceId(slugOrId);
    if (!resolved) throw new NotFoundException('Service not found');
    const serviceId = resolved.toString();

    const existing = await this.reviewModel
      .findOne({ serviceId, authorId: user.id })
      .select('_id')
      .lean()
      .exec();
    if (existing) throw new BusinessRuleException('You have already reviewed this service');

    let bookingId: string | null = null;
    if (this.requireCompletedBooking) {
      const booking = await this.bookingModel
        .findOne({ serviceId, customerId: user.id, status: BookingStatus.COMPLETED })
        .select('_id')
        .lean()
        .exec();
      if (!booking) {
        throw new BusinessRuleException(
          'You can only review a service after completing a booking for it',
        );
      }
      bookingId = booking._id.toString();
    }

    return this.tx.run(async (session) => {
      const [review] = await this.reviewModel.create(
        [
          {
            serviceId,
            authorId: user.id,
            bookingId,
            rating: dto.rating,
            title: dto.title ?? null,
            body: dto.body ?? null,
          },
        ],
        { session },
      );
      await this.recompute(serviceId, session);
      return toRecord(review.toObject() as never);
    });
  }

  /** Edits the caller's own review within the edit window; recomputes aggregates. */
  async update(user: AuthUser, reviewId: string, dto: UpdateReviewDto): Promise<ReviewRecord> {
    const review = await this.reviewModel.findById(reviewId).exec();
    if (!review) throw new NotFoundException('Review not found');
    if (review.authorId.toString() !== user.id) {
      throw new ForbiddenException('You can only edit your own review');
    }
    if (Date.now() - (review as unknown as { createdAt: Date }).createdAt.getTime() > EDIT_WINDOW_MS) {
      throw new BusinessRuleException('The edit window for this review has passed');
    }
    const serviceId = review.serviceId.toString();

    return this.tx.run(async (session) => {
      const patch: Record<string, unknown> = {};
      if (dto.rating !== undefined) patch.rating = dto.rating;
      if (dto.title !== undefined) patch.title = dto.title || null;
      if (dto.body !== undefined) patch.body = dto.body || null;

      const updated = await this.reviewModel
        .findByIdAndUpdate(reviewId, { $set: patch }, { new: true, session })
        .lean()
        .exec();
      if (dto.rating !== undefined) await this.recompute(serviceId, session);
      return toRecord(updated as never);
    });
  }

  /** Deletes a review (author or admin) and recomputes aggregates. */
  async remove(user: AuthUser, reviewId: string): Promise<void> {
    const review = await this.reviewModel.findById(reviewId).exec();
    if (!review) throw new NotFoundException('Review not found');
    const isOwner = review.authorId.toString() === user.id;
    const isAdmin = user.role === UserRole.ADMIN;
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot delete this review');
    }
    const serviceId = review.serviceId.toString();

    await this.tx.run(async (session) => {
      await this.reviewModel.deleteOne({ _id: reviewId }, { session });
      await this.recompute(serviceId, session);
    });
  }

  /** Recomputes a service's cached rating + reviewCount from published reviews. */
  private async recompute(serviceId: string, session: ClientSession): Promise<void> {
    const [agg] = await this.reviewModel
      .aggregate<{ avg: number | null; count: number }>([
        { $match: { serviceId: new Types.ObjectId(serviceId), isPublished: true } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
      ])
      .session(session);

    const count = agg?.count ?? 0;
    const avg = agg?.avg ?? null;
    await this.serviceModel.updateOne(
      { _id: serviceId },
      {
        $set: {
          reviewCount: count,
          // Decimal128 rounded to 2dp; `.toString()` trims trailing zeros to
          // preserve the prior response shape (e.g. 4.00 → "4").
          rating: avg !== null ? Types.Decimal128.fromString(round2(avg).toString()) : null,
        },
      },
      { session },
    );
  }
}

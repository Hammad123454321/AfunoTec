import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, Review } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
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

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /** Whether a completed booking is required before a customer can review. */
  private get requireCompletedBooking(): boolean {
    return (process.env.REVIEWS_REQUIRE_BOOKING ?? 'true') !== 'false';
  }

  /** Public, paginated list of published reviews for a service. */
  async listForService(serviceId: string, query: PaginationQueryDto): Promise<Paginated<unknown>> {
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const where: Prisma.ReviewWhereInput = { serviceId, isPublished: true };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { author: { select: { id: true, name: true, profileUrl: true } } },
      }),
      this.prisma.review.count({ where }),
    ]);
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  /**
   * Creates a review. Requires a COMPLETED booking for the service (unless
   * disabled by config). One review per author per service. Recomputes the
   * service's cached rating/reviewCount in the same transaction.
   */
  async create(user: AuthUser, serviceId: string, dto: CreateReviewDto): Promise<Review> {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, deletedAt: null },
      select: { id: true },
    });
    if (!service) throw new NotFoundException('Service not found');

    const existing = await this.prisma.review.findFirst({
      where: { serviceId, authorId: user.id },
      select: { id: true },
    });
    if (existing) throw new BusinessRuleException('You have already reviewed this service');

    let bookingId: string | null = null;
    if (this.requireCompletedBooking) {
      const booking = await this.prisma.booking.findFirst({
        where: { serviceId, customerId: user.id, status: 'COMPLETED' },
        select: { id: true },
      });
      if (!booking) {
        throw new BusinessRuleException(
          'You can only review a service after completing a booking for it',
        );
      }
      bookingId = booking.id;
    }

    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          serviceId,
          authorId: user.id,
          bookingId,
          rating: dto.rating,
          title: dto.title ?? null,
          body: dto.body ?? null,
        },
      });
      await this.recompute(tx, serviceId);
      return review;
    });
  }

  /** Edits the caller's own review within the edit window; recomputes aggregates. */
  async update(user: AuthUser, reviewId: string, dto: UpdateReviewDto): Promise<Review> {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.authorId !== user.id) {
      throw new ForbiddenException('You can only edit your own review');
    }
    if (Date.now() - review.createdAt.getTime() > EDIT_WINDOW_MS) {
      throw new BusinessRuleException('The edit window for this review has passed');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id: reviewId },
        data: {
          ...(dto.rating !== undefined && { rating: dto.rating }),
          ...(dto.title !== undefined && { title: dto.title || null }),
          ...(dto.body !== undefined && { body: dto.body || null }),
        },
      });
      if (dto.rating !== undefined) await this.recompute(tx, review.serviceId);
      return updated;
    });
  }

  /** Deletes a review (author or admin) and recomputes aggregates. */
  async remove(user: AuthUser, reviewId: string): Promise<void> {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    const isOwner = review.authorId === user.id;
    const isAdmin = user.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You cannot delete this review');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.review.delete({ where: { id: reviewId } });
      await this.recompute(tx, review.serviceId);
    });
  }

  /** Recomputes a service's cached rating + reviewCount from published reviews. */
  private async recompute(tx: Prisma.TransactionClient, serviceId: string): Promise<void> {
    const agg = await tx.review.aggregate({
      where: { serviceId, isPublished: true },
      _avg: { rating: true },
      _count: true,
    });
    await tx.service.update({
      where: { id: serviceId },
      data: {
        reviewCount: agg._count,
        rating: agg._avg.rating !== null ? new Prisma.Decimal(agg._avg.rating.toFixed(2)) : null,
      },
    });
  }
}

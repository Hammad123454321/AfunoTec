import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  NewsletterSubscriber,
  NewsletterSubscriberDocument,
} from '../../database/schemas/newsletter-subscriber.schema';
import { toRecord } from '../../database/schemas/schema.helpers';
import { escapeRegExp } from '../../common/utils/regex.util';
import {
  buildPaginationMeta,
  clampPagination,
  Paginated,
} from '../../common/utils/pagination';
import { SubscribeDto } from './dto/subscribe.dto';
import { QuerySubscribersDto } from './dto/query-subscribers.dto';

export interface SubscriberRecord {
  id: string;
  email: string;
  locale?: string | null;
  isActive: boolean;
}

const subscriberRecord = (
  doc: { _id: { toString(): string } } & Record<string, unknown>,
): SubscriberRecord => toRecord<Omit<SubscriberRecord, 'id'>>(doc);

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(NewsletterSubscriber.name)
    private readonly subscriberModel: Model<NewsletterSubscriberDocument>,
  ) {}

  /** Public subscribe; idempotent and re-activates a previously removed email. */
  async subscribe(dto: SubscribeDto): Promise<{ subscribed: boolean }> {
    const email = dto.email.toLowerCase().trim();
    await this.subscriberModel
      .findOneAndUpdate(
        { email },
        {
          $set: { isActive: true, ...(dto.locale && { locale: dto.locale }) },
          $setOnInsert: { email, ...(dto.locale ? {} : { locale: null }) },
        },
        { new: true, upsert: true },
      )
      .exec();
    return { subscribed: true };
  }

  /** Admin: paginated subscriber list. */
  async list(query: QuerySubscribersDto): Promise<Paginated<SubscriberRecord>> {
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const filter: FilterQuery<NewsletterSubscriberDocument> = {};
    if (query.isActive !== undefined) filter.isActive = query.isActive;
    if (query.query) filter.email = new RegExp(escapeRegExp(query.query), 'i');

    const [data, total] = await Promise.all([
      this.subscriberModel
        .find(filter)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(take)
        .lean()
        .exec(),
      this.subscriberModel.countDocuments(filter).exec(),
    ]);
    return {
      data: data.map((d) => subscriberRecord(d)),
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  /** Admin: remove a subscriber. */
  async remove(id: string): Promise<void> {
    const existing = await this.subscriberModel.exists({ _id: id });
    if (!existing) throw new NotFoundException('Subscriber not found');
    await this.subscriberModel.deleteOne({ _id: id });
  }
}

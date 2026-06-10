import { Injectable, NotFoundException } from '@nestjs/common';
import { NewsletterSubscriber, Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  buildPaginationMeta,
  clampPagination,
  Paginated,
} from '../../common/utils/pagination';
import { SubscribeDto } from './dto/subscribe.dto';
import { QuerySubscribersDto } from './dto/query-subscribers.dto';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public subscribe; idempotent and re-activates a previously removed email. */
  async subscribe(dto: SubscribeDto): Promise<{ subscribed: boolean }> {
    const email = dto.email.toLowerCase().trim();
    await this.prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true, ...(dto.locale && { locale: dto.locale }) },
      create: { email, locale: dto.locale ?? null },
    });
    return { subscribed: true };
  }

  /** Admin: paginated subscriber list. */
  async list(query: QuerySubscribersDto): Promise<Paginated<NewsletterSubscriber>> {
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const where: Prisma.NewsletterSubscriberWhereInput = {};
    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.query) where.email = { contains: query.query, mode: 'insensitive' };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.newsletterSubscriber.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
      this.prisma.newsletterSubscriber.count({ where }),
    ]);
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  /** Admin: remove a subscriber. */
  async remove(id: string): Promise<void> {
    const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Subscriber not found');
    await this.prisma.newsletterSubscriber.delete({ where: { id } });
  }
}

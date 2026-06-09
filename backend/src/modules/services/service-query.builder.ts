import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { parseSort } from '../../common/dto/pagination-query.dto';
import { QueryServicesDto } from './dto/query-services.dto';

const SORTABLE = ['createdAt', 'basePrice', 'rating', 'viewCount', 'name'] as const;

/** Builds the Prisma where/orderBy for the public service listing. */
@Injectable()
export class ServiceQueryBuilder {
  buildWhere(query: QueryServicesDto): Prisma.ServiceWhereInput {
    const where: Prisma.ServiceWhereInput = { status: 'ACTIVE', deletedAt: null };

    if (query.categorySlug) where.category = { slug: query.categorySlug };
    if (query.location) where.location = { equals: query.location, mode: 'insensitive' };
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.basePrice = {};
      if (query.minPrice !== undefined) where.basePrice.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.basePrice.lte = query.maxPrice;
    }

    if (query.tags?.length) {
      where.tags = { some: { tag: { slug: { in: query.tags } } } };
    }

    if (query.query) {
      where.OR = [
        { name: { contains: query.query, mode: 'insensitive' } },
        { title: { contains: query.query, mode: 'insensitive' } },
        { shortSummary: { contains: query.query, mode: 'insensitive' } },
        { city: { contains: query.query, mode: 'insensitive' } },
      ];
    }

    // Availability window: at least one open, non-sold-out day in [checkIn, checkOut).
    if (query.checkIn && query.checkOut) {
      where.availabilities = {
        some: {
          date: { gte: new Date(query.checkIn), lt: new Date(query.checkOut) },
          isClosed: false,
        },
      };
    }

    return where;
  }

  buildOrderBy(query: QueryServicesDto): Prisma.ServiceOrderByWithRelationInput {
    return parseSort(query.sort, SORTABLE) ?? { createdAt: 'desc' };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../../database/schemas/category.schema';
import { Tag, TagDocument } from '../../database/schemas/tag.schema';
import {
  ServiceAvailability,
  ServiceAvailabilityDocument,
} from '../../database/schemas/service-availability.schema';
import { ServiceDocument } from '../../database/schemas/service.schema';
import { ServiceStatus } from '../../common/enums';
import { parseSort } from '../../common/dto/pagination-query.dto';
import { escapeRegExp } from '../../common/utils/regex.util';
import { toDecimal128 } from '../../common/utils/money.util';
import { QueryServicesDto } from './dto/query-services.dto';

const SORTABLE = ['createdAt', 'basePrice', 'rating', 'viewCount', 'name'] as const;

/** Sentinel id that matches nothing, used when a slug filter resolves to no rows. */
const NO_MATCH = new Types.ObjectId('000000000000000000000000');

/** Builds the Mongoose filter/sort for the public service listing. */
@Injectable()
export class ServiceQueryBuilder {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
    @InjectModel(ServiceAvailability.name)
    private readonly availabilityModel: Model<ServiceAvailabilityDocument>,
  ) {}

  /**
   * Builds the Mongoose filter for the public listing. Cross-collection filters
   * (category slug, tag slugs, availability window) are resolved to ObjectId
   * constraints up front, since Mongo cannot join inside a single find.
   */
  async buildWhere(query: QueryServicesDto): Promise<FilterQuery<ServiceDocument>> {
    const where: FilterQuery<ServiceDocument> = {
      status: ServiceStatus.ACTIVE,
      deletedAt: null,
    };

    if (query.categorySlug) {
      const category = await this.categoryModel
        .findOne({ slug: query.categorySlug })
        .select('_id')
        .lean()
        .exec();
      where.categoryId = category ? category._id : NO_MATCH;
    }

    if (query.location) {
      where.location = new RegExp(`^${escapeRegExp(query.location)}$`, 'i');
    }
    if (query.city) {
      where.city = new RegExp(escapeRegExp(query.city), 'i');
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const range: Record<string, Types.Decimal128> = {};
      if (query.minPrice !== undefined) range.$gte = toDecimal128(query.minPrice);
      if (query.maxPrice !== undefined) range.$lte = toDecimal128(query.maxPrice);
      where.basePrice = range;
    }

    if (query.tags?.length) {
      const tagDocs = await this.tagModel
        .find({ slug: { $in: query.tags } })
        .select('_id')
        .lean()
        .exec();
      where.tags = { $in: tagDocs.length ? tagDocs.map((t) => t._id) : [NO_MATCH] };
    }

    if (query.query) {
      const rx = new RegExp(escapeRegExp(query.query), 'i');
      where.$or = [{ name: rx }, { title: rx }, { shortSummary: rx }, { city: rx }];
    }

    // Availability window: at least one open day in [checkIn, checkOut).
    if (query.checkIn && query.checkOut) {
      const openDays = await this.availabilityModel
        .find({
          date: { $gte: new Date(query.checkIn), $lt: new Date(query.checkOut) },
          isClosed: false,
        })
        .select('serviceId')
        .lean()
        .exec();
      const ids = Array.from(new Set(openDays.map((a) => a.serviceId.toString()))).map(
        (id) => new Types.ObjectId(id),
      );
      where._id = { $in: ids.length ? ids : [NO_MATCH] };
    }

    return where;
  }

  buildSort(query: QueryServicesDto): Record<string, 'asc' | 'desc'> {
    return parseSort(query.sort, SORTABLE) ?? { createdAt: 'desc' };
  }
}

import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Service, ServiceDocument } from '../../database/schemas/service.schema';
import { ServiceRoom, ServiceRoomDocument } from '../../database/schemas/service-room.schema';
import { Category, CategoryDocument } from '../../database/schemas/category.schema';
import { Tag, TagDocument } from '../../database/schemas/tag.schema';
import {
  ServiceProviderProfile,
  ServiceProviderProfileDocument,
} from '../../database/schemas/service-provider-profile.schema';
import { ServiceStatus } from '../../common/enums';
import { toRecord } from '../../database/schemas/schema.helpers';
import { TransactionService } from '../../database/transaction.service';
import { toDecimal128 } from '../../common/utils/money.util';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import {
  buildPaginationMeta,
  clampPagination,
  Paginated,
} from '../../common/utils/pagination';
import { ensureUniqueSlug } from '../../common/utils/slug.util';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServicesDto } from './dto/query-services.dto';
import { ServiceImageDto, ServicePackageItemDto } from './dto/nested.dto';
import { ServiceQueryBuilder } from './service-query.builder';
import { ServicePricingService, PricingDiscount } from './service-pricing.service';

/** Allowed status transitions; ARCHIVED is terminal. */
const STATUS_TRANSITIONS: Record<ServiceStatus, ServiceStatus[]> = {
  [ServiceStatus.DRAFT]: [ServiceStatus.ACTIVE, ServiceStatus.ARCHIVED],
  [ServiceStatus.ACTIVE]: [ServiceStatus.INACTIVE, ServiceStatus.ARCHIVED],
  [ServiceStatus.INACTIVE]: [ServiceStatus.ACTIVE, ServiceStatus.ARCHIVED],
  [ServiceStatus.ARCHIVED]: [],
};

/** Fields returned in list views (mirrors the former Prisma select). */
const LIST_PROJECTION =
  'slug name title shortSummary location city basePrice currency priceUnit rating ' +
  'reviewCount viewCount status createdAt categoryId images';

type ServiceRecord = Record<string, unknown> & { id: string };

/** A lean Service doc as read from Mongo (subset we touch). */
interface LeanService {
  _id: Types.ObjectId;
  basePrice: Types.Decimal128;
  rating?: Types.Decimal128 | null;
  images?: Array<{ isPrimary?: boolean }>;
  discounts?: PricingDiscount[];
  [key: string]: unknown;
}

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(ServiceRoom.name) private readonly roomModel: Model<ServiceRoomDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
    @InjectModel(ServiceProviderProfile.name)
    private readonly providerModel: Model<ServiceProviderProfileDocument>,
    private readonly queryBuilder: ServiceQueryBuilder,
    private readonly pricing: ServicePricingService,
    private readonly tx: TransactionService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  // -- Creation ---------------------------------------------------------------

  /** Creates a DRAFT service with all embedded collections; rooms are a separate collection. */
  async create(user: AuthUser, dto: CreateServiceDto): Promise<ServiceRecord> {
    const providerId = await this.resolveProviderId(user);

    const category = await this.categoryModel
      .findById(dto.categoryId)
      .select('_id')
      .lean()
      .exec();
    if (!category) throw new BusinessRuleException('Category does not exist');

    const slug = await ensureUniqueSlug(dto.slug ?? dto.name, (candidate) =>
      this.serviceModel.exists({ slug: candidate }).then(Boolean),
    );

    const packageItems = [
      ...this.packageItems(dto.packageSummary, 'summary'),
      ...this.packageItems(dto.packageConditions, 'conditions'),
      ...this.packageItems(dto.whyStayHere, 'whyStayHere'),
    ];

    const doc = {
      slug,
      providerId: new Types.ObjectId(providerId),
      categoryId: new Types.ObjectId(dto.categoryId),
      name: dto.name.trim(),
      title: dto.title.trim(),
      shortSummary: dto.shortSummary ?? null,
      description: dto.description ?? null,
      duration: dto.duration ?? null,
      location: dto.location ?? null,
      city: dto.city ?? null,
      address: dto.address ?? null,
      basePrice: toDecimal128(dto.basePrice),
      currency: dto.currency ?? 'MGA',
      priceUnit: dto.priceUnit ?? 'per_night',
      translations: dto.translations ?? null,
      contactInfo: dto.contactInfo ?? null,
      tags: (dto.tagIds ?? []).map((id) => new Types.ObjectId(id)),
      images: (dto.images ?? []).map((i) => this.imageData(i)),
      detailPoints: (dto.detailPoints ?? []).map((d) => ({
        title: d.title,
        description: d.description ?? null,
        sortOrder: d.sortOrder ?? 0,
      })),
      packageItems,
      addOns: (dto.addOns ?? []).map((a) => ({
        title: a.title,
        price: toDecimal128(a.price),
        currency: a.currency ?? 'MGA',
      })),
      discounts: (dto.discounts ?? []).map((d) => ({
        type: d.type,
        value: toDecimal128(d.value),
        badge: d.badge ?? null,
        startAt: new Date(d.startAt),
        endAt: new Date(d.endAt),
      })),
    };

    if (dto.rooms?.length) {
      return this.tx.run(async (session) => {
        const [created] = await this.serviceModel.create([doc], { session });
        await this.roomModel.create(
          dto.rooms!.map((r) => ({
            serviceId: created._id,
            name: r.name,
            capacity: r.capacity ?? 2,
            basePrice: toDecimal128(r.basePrice),
            currency: r.currency ?? 'MGA',
            qtyTotal: r.qtyTotal ?? 1,
          })),
          { session },
        );
        return toRecord(created.toObject() as never);
      });
    }

    const created = await this.serviceModel.create(doc);
    return toRecord(created.toObject() as never);
  }

  // -- Public reads -----------------------------------------------------------

  /** Public, paginated listing with filters; attaches the effective price per item. */
  async list(query: QueryServicesDto): Promise<Paginated<unknown>> {
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const where = await this.queryBuilder.buildWhere(query);
    const sort = this.queryBuilder.buildSort(query);

    const [rows, total] = await Promise.all([
      this.serviceModel
        .find(where)
        .sort(sort)
        .skip(skip)
        .limit(take)
        .select(`${LIST_PROJECTION} discounts`)
        .lean()
        .exec(),
      this.serviceModel.countDocuments(where).exec(),
    ]);

    const data = (rows as unknown as LeanService[]).map((s) => {
      const { discounts, ...rest } = s;
      const price = this.pricing.compute({ basePrice: s.basePrice, discounts: discounts ?? [] });
      const rec = toRecord(rest as never) as ServiceRecord;
      return {
        ...rec,
        basePrice: s.basePrice.toString(),
        rating: s.rating?.toString() ?? null,
        images: this.primaryImage(s.images),
        effectivePrice: price.effectivePrice.toString(),
        discountBadge: price.badge,
      };
    });

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  /** Full detail page payload for a service, by slug. */
  async getBySlug(slug: string): Promise<unknown> {
    const service = (await this.serviceModel
      .findOne({ slug, deletedAt: null })
      .lean()
      .exec()) as LeanService | null;
    if (!service) throw new NotFoundException('Service not found');

    const [category, provider, rooms, tags] = await Promise.all([
      this.categoryModel
        .findById(service.categoryId as Types.ObjectId)
        .select('slug name type')
        .lean()
        .exec(),
      this.providerModel
        .findById(service.providerId as Types.ObjectId)
        .select('businessName isVerified logoUrl')
        .lean()
        .exec(),
      this.roomModel.find({ serviceId: service._id, isActive: true }).lean().exec(),
      this.tagModel
        .find({ _id: { $in: (service.tags as Types.ObjectId[]) ?? [] } })
        .select('slug name')
        .lean()
        .exec(),
    ]);

    const price = this.pricing.compute({
      basePrice: service.basePrice,
      discounts: (service.discounts ?? []).filter((d) => d.isActive),
    });

    const rec = toRecord(service as never) as ServiceRecord;
    return {
      ...rec,
      category: category ? toRecord(category as never) : null,
      provider: provider ? toRecord(provider as never) : null,
      rooms: rooms.map((r) => toRecord(r as never)),
      addOns: ((service.addOns as Array<{ isActive?: boolean }>) ?? []).filter(
        (a) => a.isActive !== false,
      ),
      discounts: (service.discounts ?? []).filter((d) => d.isActive),
      tags: tags.map((t) => toRecord(t as never)),
      basePrice: service.basePrice.toString(),
      rating: service.rating?.toString() ?? null,
      effectivePrice: price.effectivePrice.toString(),
      discountApplied: price.discountApplied.toString(),
      discountBadge: price.badge,
    };
  }

  /** Increments viewCount at most once per (service, ip) per debounce window. */
  async trackView(slugOrId: string, ip: string | null): Promise<void> {
    const or: FilterQuery<ServiceDocument>[] = [{ slug: slugOrId }];
    if (Types.ObjectId.isValid(slugOrId)) or.push({ _id: slugOrId });
    const service = await this.serviceModel
      .findOne({ $or: or, deletedAt: null })
      .select('_id')
      .lean()
      .exec();
    if (!service) throw new NotFoundException('Service not found');

    const id = service._id.toString();
    const key = `view:${id}:${ip ?? 'anon'}`;
    const seen = await this.cache.get(key);
    if (seen) return;
    await this.cache.set(key, 1, 30 * 60 * 1000); // 30-minute debounce
    await this.serviceModel.updateOne({ _id: id }, { $inc: { viewCount: 1 } }).exec();
  }

  // -- Provider/admin -----------------------------------------------------------

  /** The caller's own services (any status). */
  async listMine(user: AuthUser, query: QueryServicesDto): Promise<Paginated<unknown>> {
    const providerId = await this.resolveProviderId(user);
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const where: FilterQuery<ServiceDocument> = { providerId, deletedAt: null };

    const [rows, total] = await Promise.all([
      this.serviceModel
        .find(where)
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(take)
        .select(LIST_PROJECTION)
        .lean()
        .exec(),
      this.serviceModel.countDocuments(where).exec(),
    ]);
    const data = (rows as unknown as LeanService[]).map((s) => {
      const rec = toRecord(s as never) as ServiceRecord;
      return {
        ...rec,
        basePrice: s.basePrice.toString(),
        rating: s.rating?.toString() ?? null,
        images: this.primaryImage(s.images),
      };
    });
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async update(id: string, dto: UpdateServiceDto): Promise<ServiceRecord> {
    await this.ensureExists(id);
    if (dto.categoryId) {
      const cat = await this.categoryModel.findById(dto.categoryId).select('_id').lean().exec();
      if (!cat) throw new BusinessRuleException('Category does not exist');
    }
    let slug: string | undefined;
    if (dto.slug) {
      slug = await ensureUniqueSlug(dto.slug, (candidate) =>
        this.serviceModel
          .exists({ slug: candidate, _id: { $ne: id } })
          .then(Boolean),
      );
    }

    const patch: Record<string, unknown> = {};
    if (slug) patch.slug = slug;
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.title !== undefined) patch.title = dto.title.trim();
    if (dto.categoryId !== undefined) patch.categoryId = new Types.ObjectId(dto.categoryId);
    if (dto.shortSummary !== undefined) patch.shortSummary = dto.shortSummary || null;
    if (dto.description !== undefined) patch.description = dto.description || null;
    if (dto.duration !== undefined) patch.duration = dto.duration || null;
    if (dto.location !== undefined) patch.location = dto.location || null;
    if (dto.city !== undefined) patch.city = dto.city || null;
    if (dto.address !== undefined) patch.address = dto.address || null;
    if (dto.basePrice !== undefined) patch.basePrice = toDecimal128(dto.basePrice);
    if (dto.currency !== undefined) patch.currency = dto.currency;
    if (dto.priceUnit !== undefined) patch.priceUnit = dto.priceUnit;
    if (dto.translations !== undefined) patch.translations = dto.translations;
    if (dto.contactInfo !== undefined) patch.contactInfo = dto.contactInfo;

    const updated = await this.serviceModel
      .findByIdAndUpdate(id, { $set: patch }, { new: true })
      .lean()
      .exec();
    return toRecord(updated as never);
  }

  /** Validated status transition (rejects illegal moves with 422). */
  async setStatus(id: string, status: ServiceStatus): Promise<ServiceRecord> {
    const service = await this.serviceModel
      .findOne({ _id: id, deletedAt: null })
      .select('status')
      .lean()
      .exec();
    if (!service) throw new NotFoundException('Service not found');
    if (service.status === status) {
      const current = await this.serviceModel.findById(id).lean().exec();
      return toRecord(current as never);
    }

    if (!STATUS_TRANSITIONS[service.status].includes(status)) {
      throw new BusinessRuleException(
        `Cannot transition a service from ${service.status} to ${status}`,
      );
    }
    const updated = await this.serviceModel
      .findByIdAndUpdate(id, { $set: { status } }, { new: true })
      .lean()
      .exec();
    return toRecord(updated as never);
  }

  async addImages(id: string, images: ServiceImageDto[]): Promise<ServiceRecord> {
    await this.ensureExists(id);
    // Enforce a single primary across new + existing.
    const wantsPrimary = images.some((i) => i.isPrimary);
    await this.tx.run(async (session) => {
      if (wantsPrimary) {
        await this.serviceModel.updateOne(
          { _id: id },
          { $set: { 'images.$[].isPrimary': false } },
          { session },
        );
      }
      await this.serviceModel.updateOne(
        { _id: id },
        { $push: { images: { $each: images.map((i) => this.imageData(i)) } } },
        { session },
      );
    });
    const updated = await this.serviceModel.findById(id).lean().exec();
    return toRecord(updated as never);
  }

  async removeImage(serviceId: string, imageId: string): Promise<void> {
    const res = await this.serviceModel
      .updateOne({ _id: serviceId }, { $pull: { images: { _id: imageId } } })
      .exec();
    if (res.modifiedCount === 0) throw new NotFoundException('Image not found');
  }

  /** Soft delete. */
  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.serviceModel
      .updateOne(
        { _id: id },
        { $set: { deletedAt: new Date(), status: ServiceStatus.ARCHIVED } },
      )
      .exec();
  }

  // -- Helpers ----------------------------------------------------------------

  private imageData(i: ServiceImageDto): Record<string, unknown> {
    return {
      url: i.url,
      alt: i.alt ?? null,
      sortOrder: i.sortOrder ?? 0,
      isPrimary: i.isPrimary ?? false,
    };
  }

  private packageItems(
    items: ServicePackageItemDto[] | undefined,
    kind: 'summary' | 'conditions' | 'whyStayHere',
  ): Array<Record<string, unknown>> {
    return (items ?? []).map((p) => ({
      title: p.title,
      description: p.description ?? null,
      sortOrder: p.sortOrder ?? 0,
      kind,
    }));
  }

  /** Reduces embedded images to the single primary one (mirrors the former include filter). */
  private primaryImage(
    images: Array<{ isPrimary?: boolean }> | undefined,
  ): Array<{ isPrimary?: boolean }> {
    return (images ?? []).filter((i) => i.isPrimary).slice(0, 1);
  }

  /** Resolves the provider profile id for the caller (admins must own a profile too, or 403). */
  private async resolveProviderId(user: AuthUser): Promise<string> {
    const profile = await this.providerModel
      .findOne({ userId: user.id })
      .select('_id')
      .lean()
      .exec();
    if (!profile) {
      throw new ForbiddenException('A service-provider profile is required to manage services');
    }
    return profile._id.toString();
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.serviceModel.exists({ _id: id, deletedAt: null });
    if (!found) throw new NotFoundException('Service not found');
  }
}

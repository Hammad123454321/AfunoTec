import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Prisma, Service, ServiceStatus } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
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
import { ServiceImageDto } from './dto/nested.dto';
import { ServiceQueryBuilder } from './service-query.builder';
import { ServicePricingService } from './service-pricing.service';

/** Allowed status transitions; ARCHIVED is terminal. */
const STATUS_TRANSITIONS: Record<ServiceStatus, ServiceStatus[]> = {
  DRAFT: ['ACTIVE', 'ARCHIVED'],
  ACTIVE: ['INACTIVE', 'ARCHIVED'],
  INACTIVE: ['ACTIVE', 'ARCHIVED'],
  ARCHIVED: [],
};

const LIST_SELECT = {
  id: true,
  slug: true,
  name: true,
  title: true,
  shortSummary: true,
  location: true,
  city: true,
  basePrice: true,
  currency: true,
  priceUnit: true,
  rating: true,
  reviewCount: true,
  viewCount: true,
  status: true,
  createdAt: true,
  category: { select: { id: true, slug: true, name: true, type: true } },
  images: { where: { isPrimary: true }, take: 1, select: { url: true, alt: true } },
} satisfies Prisma.ServiceSelect;

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBuilder: ServiceQueryBuilder,
    private readonly pricing: ServicePricingService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  // -- Creation ---------------------------------------------------------------

  /** Creates a DRAFT service with all nested collections in one transaction. */
  async create(user: AuthUser, dto: CreateServiceDto): Promise<Service> {
    const providerId = await this.resolveProviderId(user);

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
      select: { id: true },
    });
    if (!category) throw new BusinessRuleException('Category does not exist');

    const slug = await ensureUniqueSlug(dto.slug ?? dto.name, (candidate) =>
      this.prisma.service.findUnique({ where: { slug: candidate }, select: { id: true } }).then(Boolean),
    );

    return this.prisma.service.create({
      data: {
        slug,
        providerId,
        categoryId: dto.categoryId,
        name: dto.name.trim(),
        title: dto.title.trim(),
        shortSummary: dto.shortSummary ?? null,
        description: dto.description ?? null,
        duration: dto.duration ?? null,
        location: dto.location ?? null,
        city: dto.city ?? null,
        address: dto.address ?? null,
        basePrice: new Prisma.Decimal(dto.basePrice),
        currency: dto.currency ?? 'MGA',
        priceUnit: dto.priceUnit ?? 'per_night',
        translations: (dto.translations ?? undefined) as Prisma.InputJsonValue | undefined,
        contactInfo: (dto.contactInfo ?? undefined) as Prisma.InputJsonValue | undefined,
        ...(dto.tagIds?.length && {
          tags: { create: dto.tagIds.map((tagId) => ({ tagId })) },
        }),
        ...(dto.images?.length && { images: { create: dto.images.map((i) => this.imageData(i)) } }),
        ...(dto.detailPoints?.length && { detailPoints: { create: dto.detailPoints } }),
        ...(dto.packageSummary?.length && { packageSummary: { create: dto.packageSummary } }),
        ...(dto.packageConditions?.length && {
          packageConditions: { create: dto.packageConditions },
        }),
        ...(dto.whyStayHere?.length && { whyStayHere: { create: dto.whyStayHere } }),
        ...(dto.addOns?.length && {
          addOns: {
            create: dto.addOns.map((a) => ({
              title: a.title,
              price: new Prisma.Decimal(a.price),
              currency: a.currency ?? 'MGA',
            })),
          },
        }),
        ...(dto.rooms?.length && {
          rooms: {
            create: dto.rooms.map((r) => ({
              name: r.name,
              capacity: r.capacity ?? 2,
              basePrice: new Prisma.Decimal(r.basePrice),
              currency: r.currency ?? 'MGA',
              qtyTotal: r.qtyTotal ?? 1,
            })),
          },
        }),
        ...(dto.discounts?.length && {
          discounts: {
            create: dto.discounts.map((d) => ({
              type: d.type,
              value: new Prisma.Decimal(d.value),
              badge: d.badge ?? null,
              startAt: new Date(d.startAt),
              endAt: new Date(d.endAt),
            })),
          },
        }),
      },
    });
  }

  // -- Public reads -----------------------------------------------------------

  /** Public, paginated listing with filters; attaches the effective price per item. */
  async list(query: QueryServicesDto): Promise<Paginated<unknown>> {
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const where = this.queryBuilder.buildWhere(query);
    const orderBy = this.queryBuilder.buildOrderBy(query);

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where,
        orderBy,
        skip,
        take,
        select: { ...LIST_SELECT, discounts: { where: { isActive: true } } },
      }),
      this.prisma.service.count({ where }),
    ]);

    const data = rows.map((s) => {
      const { discounts, ...rest } = s as typeof s & { discounts: never[] };
      const price = this.pricing.compute({ basePrice: s.basePrice, discounts: discounts as never });
      return {
        ...rest,
        effectivePrice: price.effectivePrice.toString(),
        discountBadge: price.badge,
      };
    });

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  /** Full detail page payload for an ACTIVE service, by slug. */
  async getBySlug(slug: string): Promise<unknown> {
    const service = await this.prisma.service.findFirst({
      where: { slug, deletedAt: null },
      include: {
        category: { select: { id: true, slug: true, name: true, type: true } },
        provider: { select: { id: true, businessName: true, isVerified: true, logoUrl: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        detailPoints: { orderBy: { sortOrder: 'asc' } },
        packageSummary: { orderBy: { sortOrder: 'asc' } },
        packageConditions: { orderBy: { sortOrder: 'asc' } },
        whyStayHere: { orderBy: { sortOrder: 'asc' } },
        addOns: { where: { isActive: true } },
        rooms: { where: { isActive: true } },
        discounts: { where: { isActive: true } },
        tags: { include: { tag: { select: { id: true, slug: true, name: true } } } },
      },
    });
    if (!service) throw new NotFoundException('Service not found');

    const price = this.pricing.compute({ basePrice: service.basePrice, discounts: service.discounts });
    return {
      ...service,
      tags: service.tags.map((t) => t.tag),
      basePrice: service.basePrice.toString(),
      rating: service.rating?.toString() ?? null,
      effectivePrice: price.effectivePrice.toString(),
      discountApplied: price.discountApplied.toString(),
      discountBadge: price.badge,
    };
  }

  /** Increments viewCount at most once per (service, ip) per debounce window. */
  async trackView(slugOrId: string, ip: string | null): Promise<void> {
    const service = await this.prisma.service.findFirst({
      where: { OR: [{ id: slugOrId }, { slug: slugOrId }], deletedAt: null },
      select: { id: true },
    });
    if (!service) throw new NotFoundException('Service not found');

    const key = `view:${service.id}:${ip ?? 'anon'}`;
    const seen = await this.cache.get(key);
    if (seen) return;
    await this.cache.set(key, 1, 30 * 60 * 1000); // 30-minute debounce
    await this.prisma.service.update({
      where: { id: service.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  // -- Provider/admin -----------------------------------------------------------

  /** The caller's own services (any status). */
  async listMine(user: AuthUser, query: QueryServicesDto): Promise<Paginated<unknown>> {
    const providerId = await this.resolveProviderId(user);
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const where: Prisma.ServiceWhereInput = { providerId, deletedAt: null };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take, select: LIST_SELECT }),
      this.prisma.service.count({ where }),
    ]);
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    await this.ensureExists(id);
    if (dto.categoryId) {
      const cat = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
        select: { id: true },
      });
      if (!cat) throw new BusinessRuleException('Category does not exist');
    }
    let slug: string | undefined;
    if (dto.slug) {
      slug = await ensureUniqueSlug(dto.slug, (candidate) =>
        this.prisma.service
          .findFirst({ where: { slug: candidate, NOT: { id } }, select: { id: true } })
          .then(Boolean),
      );
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.shortSummary !== undefined && { shortSummary: dto.shortSummary || null }),
        ...(dto.description !== undefined && { description: dto.description || null }),
        ...(dto.duration !== undefined && { duration: dto.duration || null }),
        ...(dto.location !== undefined && { location: dto.location || null }),
        ...(dto.city !== undefined && { city: dto.city || null }),
        ...(dto.address !== undefined && { address: dto.address || null }),
        ...(dto.basePrice !== undefined && { basePrice: new Prisma.Decimal(dto.basePrice) }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.priceUnit !== undefined && { priceUnit: dto.priceUnit }),
        ...(dto.translations !== undefined && {
          translations: dto.translations as Prisma.InputJsonValue,
        }),
        ...(dto.contactInfo !== undefined && {
          contactInfo: dto.contactInfo as Prisma.InputJsonValue,
        }),
      },
    });
  }

  /** Validated status transition (rejects illegal moves with 422). */
  async setStatus(id: string, status: ServiceStatus): Promise<Service> {
    const service = await this.prisma.service.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, status: true },
    });
    if (!service) throw new NotFoundException('Service not found');
    if (service.status === status) return this.prisma.service.findUniqueOrThrow({ where: { id } });

    if (!STATUS_TRANSITIONS[service.status].includes(status)) {
      throw new BusinessRuleException(
        `Cannot transition a service from ${service.status} to ${status}`,
      );
    }
    return this.prisma.service.update({ where: { id }, data: { status } });
  }

  async addImages(id: string, images: ServiceImageDto[]): Promise<Service> {
    await this.ensureExists(id);
    // Enforce a single primary across new + existing.
    const wantsPrimary = images.some((i) => i.isPrimary);
    await this.prisma.$transaction(async (tx) => {
      if (wantsPrimary) {
        await tx.serviceImage.updateMany({ where: { serviceId: id }, data: { isPrimary: false } });
      }
      await tx.serviceImage.createMany({
        data: images.map((i) => ({ ...this.imageData(i), serviceId: id })),
      });
    });
    return this.prisma.service.findUniqueOrThrow({ where: { id }, include: { images: true } });
  }

  async removeImage(serviceId: string, imageId: string): Promise<void> {
    const image = await this.prisma.serviceImage.findFirst({
      where: { id: imageId, serviceId },
      select: { id: true },
    });
    if (!image) throw new NotFoundException('Image not found');
    await this.prisma.serviceImage.delete({ where: { id: imageId } });
  }

  /** Soft delete. */
  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.service.update({ where: { id }, data: { deletedAt: new Date(), status: 'ARCHIVED' } });
  }

  // -- Helpers ----------------------------------------------------------------

  private imageData(i: ServiceImageDto): Prisma.ServiceImageCreateManyServiceInput {
    return {
      url: i.url,
      alt: i.alt ?? null,
      sortOrder: i.sortOrder ?? 0,
      isPrimary: i.isPrimary ?? false,
    };
  }

  /** Resolves the provider profile id for the caller (admins must own a profile too, or 403). */
  private async resolveProviderId(user: AuthUser): Promise<string> {
    const profile = await this.prisma.serviceProviderProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!profile) {
      throw new ForbiddenException('A service-provider profile is required to manage services');
    }
    return profile.id;
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.prisma.service.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!found) throw new NotFoundException('Service not found');
  }
}

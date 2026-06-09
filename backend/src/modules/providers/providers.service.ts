import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ServiceProviderProfile } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  buildPaginationMeta,
  clampPagination,
  Paginated,
} from '../../common/utils/pagination';
import { parseSort } from '../../common/dto/pagination-query.dto';
import { OnboardProviderDto } from './dto/onboard-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { QueryProvidersDto } from './dto/query-providers.dto';

const SORTABLE = ['createdAt', 'businessName'] as const;

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Upgrades a customer to a service provider: creates the profile and flips
   * the user's role in a single transaction. 409 if a profile already exists.
   */
  async onboard(userId: string, dto: OnboardProviderDto): Promise<ServiceProviderProfile> {
    const existing = await this.prisma.serviceProviderProfile.findUnique({ where: { userId } });
    if (existing) {
      throw new ConflictException('This account is already a service provider');
    }

    return this.prisma.$transaction(async (tx) => {
      const profile = await tx.serviceProviderProfile.create({
        data: {
          userId,
          businessName: dto.businessName.trim(),
          legalName: dto.legalName ?? null,
          taxId: dto.taxId ?? null,
          description: dto.description ?? null,
          websiteUrl: dto.websiteUrl ?? null,
          logoUrl: dto.logoUrl ?? null,
          payoutMethod: (dto.payoutMethod ?? undefined) as Prisma.InputJsonValue | undefined,
        },
      });
      await tx.user.update({ where: { id: userId }, data: { role: 'SERVICE_PROVIDER' } });
      return profile;
    });
  }

  /** Returns the caller's own provider profile. */
  async getMine(userId: string): Promise<ServiceProviderProfile> {
    const profile = await this.prisma.serviceProviderProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Provider profile not found');
    return profile;
  }

  /** Updates the caller's own provider profile. */
  async updateMine(userId: string, dto: UpdateProviderDto): Promise<ServiceProviderProfile> {
    await this.getMine(userId);
    return this.prisma.serviceProviderProfile.update({
      where: { userId },
      data: {
        ...(dto.businessName !== undefined && { businessName: dto.businessName.trim() }),
        ...(dto.legalName !== undefined && { legalName: dto.legalName || null }),
        ...(dto.taxId !== undefined && { taxId: dto.taxId || null }),
        ...(dto.description !== undefined && { description: dto.description || null }),
        ...(dto.websiteUrl !== undefined && { websiteUrl: dto.websiteUrl || null }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl || null }),
        ...(dto.payoutMethod !== undefined && {
          payoutMethod: dto.payoutMethod as Prisma.InputJsonValue,
        }),
      },
    });
  }

  /** Admin: marks a provider verified. */
  async verify(id: string): Promise<ServiceProviderProfile> {
    const profile = await this.prisma.serviceProviderProfile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Provider profile not found');
    return this.prisma.serviceProviderProfile.update({
      where: { id },
      data: { isVerified: true, verifiedAt: new Date() },
    });
  }

  /** Admin: paginated listing with an optional verification filter. */
  async list(query: QueryProvidersDto): Promise<Paginated<ServiceProviderProfile>> {
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const where: Prisma.ServiceProviderProfileWhereInput = {};
    if (query.isVerified !== undefined) where.isVerified = query.isVerified;
    if (query.query) {
      where.OR = [
        { businessName: { contains: query.query, mode: 'insensitive' } },
        { legalName: { contains: query.query, mode: 'insensitive' } },
      ];
    }
    const orderBy = parseSort(query.sort, SORTABLE) ?? { createdAt: 'desc' as const };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.serviceProviderProfile.findMany({ where, orderBy, skip, take }),
      this.prisma.serviceProviderProfile.count({ where }),
    ]);
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  /** Public: active services for a given provider (paginated). */
  async publicServices(
    providerId: string,
    query: QueryProvidersDto,
  ): Promise<Paginated<unknown>> {
    const provider = await this.prisma.serviceProviderProfile.findUnique({
      where: { id: providerId },
      select: { id: true },
    });
    if (!provider) throw new NotFoundException('Provider not found');

    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const where: Prisma.ServiceWhereInput = {
      providerId,
      status: 'ACTIVE',
      deletedAt: null,
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        include: { images: { where: { isPrimary: true }, take: 1 } },
      }),
      this.prisma.service.count({ where }),
    ]);
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }
}

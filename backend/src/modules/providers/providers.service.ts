import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  ServiceProviderProfile,
  ServiceProviderProfileDocument,
} from '../../database/schemas/service-provider-profile.schema';
import { Service, ServiceDocument } from '../../database/schemas/service.schema';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { ServiceStatus, UserRole } from '../../common/enums';
import { toRecord } from '../../database/schemas/schema.helpers';
import { TransactionService } from '../../database/transaction.service';
import {
  buildPaginationMeta,
  clampPagination,
  Paginated,
} from '../../common/utils/pagination';
import { parseSort } from '../../common/dto/pagination-query.dto';
import { escapeRegExp } from '../../common/utils/regex.util';
import { OnboardProviderDto } from './dto/onboard-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { QueryProvidersDto } from './dto/query-providers.dto';

const SORTABLE = ['createdAt', 'businessName'] as const;

type ProviderRecord = Record<string, unknown> & { id: string };

@Injectable()
export class ProvidersService {
  constructor(
    @InjectModel(ServiceProviderProfile.name)
    private readonly providerModel: Model<ServiceProviderProfileDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tx: TransactionService,
  ) {}

  /**
   * Upgrades a customer to a service provider: creates the profile and flips
   * the user's role in a single transaction. 409 if a profile already exists.
   */
  async onboard(userId: string, dto: OnboardProviderDto): Promise<ProviderRecord> {
    const existing = await this.providerModel.exists({ userId });
    if (existing) {
      throw new ConflictException('This account is already a service provider');
    }

    return this.tx.run(async (session) => {
      const [profile] = await this.providerModel.create(
        [
          {
            userId,
            businessName: dto.businessName.trim(),
            legalName: dto.legalName ?? null,
            taxId: dto.taxId ?? null,
            description: dto.description ?? null,
            websiteUrl: dto.websiteUrl ?? null,
            logoUrl: dto.logoUrl ?? null,
            payoutMethod: dto.payoutMethod ?? undefined,
          },
        ],
        { session },
      );
      await this.userModel.updateOne(
        { _id: userId },
        { $set: { role: UserRole.SERVICE_PROVIDER } },
        { session },
      );
      return toRecord(profile.toObject() as never);
    });
  }

  /** Returns the caller's own provider profile. */
  async getMine(userId: string): Promise<ProviderRecord> {
    const profile = await this.providerModel.findOne({ userId }).lean().exec();
    if (!profile) throw new NotFoundException('Provider profile not found');
    return toRecord(profile);
  }

  /** Updates the caller's own provider profile. */
  async updateMine(userId: string, dto: UpdateProviderDto): Promise<ProviderRecord> {
    const patch: Record<string, unknown> = {};
    if (dto.businessName !== undefined) patch.businessName = dto.businessName.trim();
    if (dto.legalName !== undefined) patch.legalName = dto.legalName || null;
    if (dto.taxId !== undefined) patch.taxId = dto.taxId || null;
    if (dto.description !== undefined) patch.description = dto.description || null;
    if (dto.websiteUrl !== undefined) patch.websiteUrl = dto.websiteUrl || null;
    if (dto.logoUrl !== undefined) patch.logoUrl = dto.logoUrl || null;
    if (dto.payoutMethod !== undefined) patch.payoutMethod = dto.payoutMethod;

    const profile = await this.providerModel
      .findOneAndUpdate({ userId }, { $set: patch }, { new: true })
      .lean()
      .exec();
    if (!profile) throw new NotFoundException('Provider profile not found');
    return toRecord(profile);
  }

  /** Admin: marks a provider verified. */
  async verify(id: string): Promise<ProviderRecord> {
    const profile = await this.providerModel
      .findByIdAndUpdate(id, { $set: { isVerified: true, verifiedAt: new Date() } }, { new: true })
      .lean()
      .exec();
    if (!profile) throw new NotFoundException('Provider profile not found');
    return toRecord(profile);
  }

  /** Admin: paginated listing with an optional verification filter. */
  async list(query: QueryProvidersDto): Promise<Paginated<ProviderRecord>> {
    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const where: FilterQuery<ServiceProviderProfileDocument> = {};
    if (query.isVerified !== undefined) where.isVerified = query.isVerified;
    if (query.query) {
      const rx = new RegExp(escapeRegExp(query.query), 'i');
      where.$or = [{ businessName: rx }, { legalName: rx }];
    }
    const sort = parseSort(query.sort, SORTABLE) ?? { createdAt: 'desc' as const };

    const [rows, total] = await Promise.all([
      this.providerModel.find(where).sort(sort).skip(skip).limit(take).lean().exec(),
      this.providerModel.countDocuments(where).exec(),
    ]);
    return { data: rows.map((r) => toRecord(r)), meta: buildPaginationMeta(total, page, limit) };
  }

  /** Public: active services for a given provider (paginated). */
  async publicServices(
    providerId: string,
    query: QueryProvidersDto,
  ): Promise<Paginated<unknown>> {
    const provider = await this.providerModel.exists({ _id: providerId });
    if (!provider) throw new NotFoundException('Provider not found');

    const { skip, take, page, limit } = clampPagination(query.page, query.limit);
    const where: FilterQuery<ServiceDocument> = {
      providerId,
      status: ServiceStatus.ACTIVE,
      deletedAt: null,
    };
    const [rows, total] = await Promise.all([
      this.serviceModel.find(where).sort({ createdAt: -1 }).skip(skip).limit(take).lean().exec(),
      this.serviceModel.countDocuments(where).exec(),
    ]);
    // Reduce embedded images to the primary one (mirrors the former include filter).
    const data = rows.map((s) => {
      const rec = toRecord<{ images?: Array<{ isPrimary?: boolean }> }>(s);
      const images = (rec.images ?? []).filter((i) => i.isPrimary).slice(0, 1);
      return { ...rec, images };
    });
    return { data, meta: buildPaginationMeta(total, page, limit) };
  }
}

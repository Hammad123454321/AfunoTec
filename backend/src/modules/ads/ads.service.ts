import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AdPlacement } from '../../common/enums';
import { AdBanner, AdBannerDocument } from '../../database/schemas/ad-banner.schema';
import {
  HomepageShowcase,
  HomepageShowcaseDocument,
} from '../../database/schemas/homepage-showcase.schema';
import { toRecord } from '../../database/schemas/schema.helpers';

export class CreateAdDto {
  placement: AdPlacement;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
  description?: string;
  translations?: unknown;
  startAt: string;
  endAt: string;
  sortOrder?: number;
}

export class UpdateAdDto {
  imageUrl?: string;
  linkUrl?: string;
  title?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

@Injectable()
export class AdsService {
  constructor(
    @InjectModel(AdBanner.name) private readonly adBannerModel: Model<AdBannerDocument>,
    @InjectModel(HomepageShowcase.name)
    private readonly showcaseModel: Model<HomepageShowcaseDocument>,
  ) {}

  async listActive(placement?: AdPlacement) {
    const now = new Date();
    const filter: FilterQuery<AdBannerDocument> = {
      isActive: true,
      startAt: { $lte: now },
      endAt: { $gte: now },
      ...(placement ? { placement } : {}),
    };
    const rows = await this.adBannerModel
      .find(filter)
      .sort({ placement: 'asc', sortOrder: 'asc' })
      .lean()
      .exec();
    return rows.map((r) => toRecord(r));
  }

  async create(dto: CreateAdDto) {
    const ad = await this.adBannerModel.create({
      placement: dto.placement,
      imageUrl: dto.imageUrl,
      linkUrl: dto.linkUrl ?? null,
      title: dto.title ?? null,
      description: dto.description ?? null,
      translations: (dto.translations ?? null) as Record<string, unknown> | null,
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),
      sortOrder: dto.sortOrder ?? 0,
    });
    return toRecord(ad.toObject() as never);
  }

  async update(id: string, dto: UpdateAdDto) {
    const ad = await this.adBannerModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean()
      .exec();
    if (!ad) throw new NotFoundException('Ad not found');
    return toRecord(ad);
  }

  async deactivate(id: string) {
    const ad = await this.adBannerModel
      .findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
      .lean()
      .exec();
    if (!ad) throw new NotFoundException('Ad not found');
    return { deactivated: true };
  }

  async listShowcases() {
    const rows = await this.showcaseModel
      .find({ isActive: true })
      .sort({ slot: 'asc' })
      .lean()
      .exec();
    return rows.map((r) => toRecord(r));
  }

  async upsertShowcase(slot: string, items: unknown) {
    const showcase = await this.showcaseModel
      .findOneAndUpdate(
        { slot },
        { $set: { items }, $setOnInsert: { slot } },
        { new: true, upsert: true },
      )
      .lean()
      .exec();
    return toRecord(showcase);
  }
}

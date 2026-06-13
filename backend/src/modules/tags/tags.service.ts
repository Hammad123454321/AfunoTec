import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { Tag, TagDocument } from '../../database/schemas/tag.schema';
import { Service, ServiceDocument } from '../../database/schemas/service.schema';
import { toRecord } from '../../database/schemas/schema.helpers';
import { ensureUniqueSlug } from '../../common/utils/slug.util';
import {
  Locale,
  normalizeLocale,
  resolveLocalizedField,
} from '../../common/utils/translations.util';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

const CACHE_KEY_ALL = 'tags:all';

export interface TagRecord {
  id: string;
  slug: string;
  name: string;
  translations?: Record<string, unknown> | null;
}

export interface TagView extends TagRecord {
  localizedName: string;
}

const tagRecord = (doc: { _id: { toString(): string } } & Record<string, unknown>): TagRecord =>
  toRecord<Omit<TagRecord, 'id'>>(doc);

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private localize(tag: TagRecord, locale: Locale): TagView {
    return {
      ...tag,
      localizedName:
        resolveLocalizedField(tag.translations as never, locale, 'name', tag.name) ?? tag.name,
    };
  }

  async list(locale?: string): Promise<TagView[]> {
    const loc = normalizeLocale(locale);
    const cached = await this.cache.get<TagRecord[]>(CACHE_KEY_ALL);
    const rows =
      cached ??
      (await this.tagModel.find().sort({ name: 'asc' }).lean().exec()).map((t) => tagRecord(t));
    if (!cached) await this.cache.set(CACHE_KEY_ALL, rows);
    return rows.map((t) => this.localize(t, loc));
  }

  async getBySlug(slug: string, locale?: string): Promise<TagView> {
    const tag = await this.tagModel.findOne({ slug }).lean().exec();
    if (!tag) throw new NotFoundException('Tag not found');
    return this.localize(tagRecord(tag), normalizeLocale(locale));
  }

  async create(dto: CreateTagDto): Promise<TagRecord> {
    const slug = await ensureUniqueSlug(dto.slug ?? dto.name, (candidate) =>
      this.tagModel.exists({ slug: candidate }).then(Boolean),
    );
    const created = await this.tagModel.create({
      slug,
      name: dto.name.trim(),
      translations: dto.translations ?? undefined,
    });
    await this.invalidate();
    return tagRecord(created.toObject() as never);
  }

  async update(id: string, dto: UpdateTagDto): Promise<TagRecord> {
    await this.ensureExists(id);
    let slug: string | undefined;
    if (dto.slug) {
      slug = await ensureUniqueSlug(dto.slug, (candidate) =>
        this.tagModel.exists({ slug: candidate, _id: { $ne: id } }).then(Boolean),
      );
    }
    const patch: Record<string, unknown> = {};
    if (slug) patch.slug = slug;
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.translations !== undefined) patch.translations = dto.translations;

    const tag = await this.tagModel
      .findByIdAndUpdate(id, { $set: patch }, { new: true })
      .lean()
      .exec();
    if (!tag) throw new NotFoundException('Tag not found');
    await this.invalidate();
    return tagRecord(tag);
  }

  /** Deletes a tag and pulls its id from every service's embedded `tags` array. */
  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.tagModel.deleteOne({ _id: id });
    await this.serviceModel.updateMany({ tags: id }, { $pull: { tags: id } });
    await this.invalidate();
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.tagModel.exists({ _id: id });
    if (!found) throw new NotFoundException('Tag not found');
  }

  private async invalidate(): Promise<void> {
    await this.cache.del(CACHE_KEY_ALL);
  }
}

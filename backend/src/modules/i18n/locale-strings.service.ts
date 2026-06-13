import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { LocaleString, LocaleStringDocument } from '../../database/schemas/locale-string.schema';
import { toRecord } from '../../database/schemas/schema.helpers';
import { UpsertLocaleStringDto } from './dto/upsert-locale-string.dto';

const CACHE_KEY = 'i18n:strings';

interface LocaleStringRow {
  key: string;
  translations: Record<string, unknown>;
  category?: string | null;
}

@Injectable()
export class LocaleStringsService {
  constructor(
    @InjectModel(LocaleString.name) private readonly localeStringModel: Model<LocaleStringDocument>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  /**
   * Public, cached map of all admin-editable strings keyed by their `key`:
   *   { "home.hero.title": { en, fr, mg }, ... }
   * Optionally filtered by category.
   */
  async getStrings(category?: string): Promise<Record<string, unknown>> {
    if (category) {
      const rows = await this.localeStringModel.find({ category }).lean().exec();
      return this.toMap(rows as LocaleStringRow[]);
    }
    const cached = await this.cache.get<LocaleStringRow[]>(CACHE_KEY);
    const rows = cached ?? (await this.localeStringModel.find().lean().exec());
    if (!cached) await this.cache.set(CACHE_KEY, rows);
    return this.toMap(rows as LocaleStringRow[]);
  }

  /** Admin: create or update a string by key. */
  async upsert(dto: UpsertLocaleStringDto): Promise<Record<string, unknown>> {
    const row = await this.localeStringModel
      .findOneAndUpdate(
        { key: dto.key },
        {
          $set: {
            translations: dto.translations,
            ...(dto.category !== undefined && { category: dto.category || null }),
          },
          $setOnInsert: { key: dto.key },
        },
        { new: true, upsert: true },
      )
      .lean()
      .exec();
    await this.cache.del(CACHE_KEY);
    return toRecord(row as never);
  }

  private toMap(rows: LocaleStringRow[]): Record<string, unknown> {
    return rows.reduce<Record<string, unknown>>((acc, r) => {
      acc[r.key] = r.translations;
      return acc;
    }, {});
  }
}

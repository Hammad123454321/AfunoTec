import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LocaleString, Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpsertLocaleStringDto } from './dto/upsert-locale-string.dto';

const CACHE_KEY = 'i18n:strings';

@Injectable()
export class LocaleStringsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  /**
   * Public, cached map of all admin-editable strings keyed by their `key`:
   *   { "home.hero.title": { en, fr, mg }, ... }
   * Optionally filtered by category.
   */
  async getStrings(category?: string): Promise<Record<string, unknown>> {
    if (category) {
      const rows = await this.prisma.localeString.findMany({ where: { category } });
      return this.toMap(rows);
    }
    const cached = await this.cache.get<LocaleString[]>(CACHE_KEY);
    const rows = cached ?? (await this.prisma.localeString.findMany());
    if (!cached) await this.cache.set(CACHE_KEY, rows);
    return this.toMap(rows);
  }

  /** Admin: create or update a string by key. */
  async upsert(dto: UpsertLocaleStringDto): Promise<LocaleString> {
    const row = await this.prisma.localeString.upsert({
      where: { key: dto.key },
      update: {
        translations: dto.translations as Prisma.InputJsonValue,
        ...(dto.category !== undefined && { category: dto.category || null }),
      },
      create: {
        key: dto.key,
        translations: dto.translations as Prisma.InputJsonValue,
        category: dto.category ?? null,
      },
    });
    await this.cache.del(CACHE_KEY);
    return row;
  }

  private toMap(rows: LocaleString[]): Record<string, unknown> {
    return rows.reduce<Record<string, unknown>>((acc, r) => {
      acc[r.key] = r.translations;
      return acc;
    }, {});
  }
}

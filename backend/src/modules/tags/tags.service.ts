import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Prisma, Tag } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ensureUniqueSlug } from '../../common/utils/slug.util';
import {
  Locale,
  normalizeLocale,
  resolveLocalizedField,
} from '../../common/utils/translations.util';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

const CACHE_KEY_ALL = 'tags:all';

export interface TagView extends Tag {
  localizedName: string;
}

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private localize(tag: Tag, locale: Locale): TagView {
    return {
      ...tag,
      localizedName:
        resolveLocalizedField(tag.translations as never, locale, 'name', tag.name) ?? tag.name,
    };
  }

  async list(locale?: string): Promise<TagView[]> {
    const loc = normalizeLocale(locale);
    const cached = await this.cache.get<Tag[]>(CACHE_KEY_ALL);
    const rows = cached ?? (await this.prisma.tag.findMany({ orderBy: { name: 'asc' } }));
    if (!cached) await this.cache.set(CACHE_KEY_ALL, rows);
    return rows.map((t) => this.localize(t, loc));
  }

  async getBySlug(slug: string, locale?: string): Promise<TagView> {
    const tag = await this.prisma.tag.findUnique({ where: { slug } });
    if (!tag) throw new NotFoundException('Tag not found');
    return this.localize(tag, normalizeLocale(locale));
  }

  async create(dto: CreateTagDto): Promise<Tag> {
    const slug = await ensureUniqueSlug(dto.slug ?? dto.name, (candidate) =>
      this.prisma.tag.findUnique({ where: { slug: candidate }, select: { id: true } }).then(Boolean),
    );
    const tag = await this.prisma.tag.create({
      data: {
        slug,
        name: dto.name.trim(),
        translations: (dto.translations ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
    await this.invalidate();
    return tag;
  }

  async update(id: string, dto: UpdateTagDto): Promise<Tag> {
    await this.ensureExists(id);
    let slug: string | undefined;
    if (dto.slug) {
      slug = await ensureUniqueSlug(dto.slug, (candidate) =>
        this.prisma.tag
          .findFirst({ where: { slug: candidate, NOT: { id } }, select: { id: true } })
          .then(Boolean),
      );
    }
    const tag = await this.prisma.tag.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.translations !== undefined && {
          translations: dto.translations as Prisma.InputJsonValue,
        }),
      },
    });
    await this.invalidate();
    return tag;
  }

  /** Deletes a tag; the ServiceTag join rows cascade (onDelete: Cascade). */
  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.tag.delete({ where: { id } });
    await this.invalidate();
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.prisma.tag.findUnique({ where: { id }, select: { id: true } });
    if (!found) throw new NotFoundException('Tag not found');
  }

  private async invalidate(): Promise<void> {
    await this.cache.del(CACHE_KEY_ALL);
  }
}

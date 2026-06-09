import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { ensureUniqueSlug, toSlug } from '../../common/utils/slug.util';
import {
  Locale,
  normalizeLocale,
  resolveLocalizedField,
} from '../../common/utils/translations.util';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoriesDto } from './dto/query-categories.dto';

const CACHE_KEYS = {
  activeList: 'categories:active', // cached public list (locale-agnostic raw rows)
};

/** Shape returned for public consumption with the localized name resolved. */
export interface CategoryView extends Category {
  localizedName: string;
}

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private localize(category: Category, locale: Locale): CategoryView {
    return {
      ...category,
      localizedName:
        resolveLocalizedField(category.translations as never, locale, 'name', category.name) ??
        category.name,
    };
  }

  /** Public/admin listing. Public callers get active categories only; cached. */
  async list(query: QueryCategoriesDto, locale?: string): Promise<CategoryView[]> {
    const loc = normalizeLocale(locale);

    // Only the (hot) active, all-types list is cached; filtered/admin views hit the DB.
    if (!query.type && !query.includeInactive) {
      const cached = await this.cache.get<Category[]>(CACHE_KEYS.activeList);
      const rows =
        cached ??
        (await this.prisma.category.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        }));
      if (!cached) await this.cache.set(CACHE_KEYS.activeList, rows);
      return rows.map((c) => this.localize(c, loc));
    }

    const where: Prisma.CategoryWhereInput = {};
    if (!query.includeInactive) where.isActive = true;
    if (query.type) where.type = query.type;
    const rows = await this.prisma.category.findMany({ where, orderBy: { sortOrder: 'asc' } });
    return rows.map((c) => this.localize(c, loc));
  }

  async getBySlug(slug: string, locale?: string): Promise<CategoryView> {
    const category = await this.prisma.category.findUnique({ where: { slug } });
    if (!category) throw new NotFoundException('Category not found');
    return this.localize(category, normalizeLocale(locale));
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = await ensureUniqueSlug(dto.slug ?? dto.name, (candidate) =>
      this.prisma.category
        .findUnique({ where: { slug: candidate }, select: { id: true } })
        .then(Boolean),
    );
    const category = await this.prisma.category.create({
      data: {
        slug,
        name: dto.name.trim(),
        type: dto.type,
        iconName: dto.iconName ?? null,
        imageUrl: dto.imageUrl ?? null,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
        translations: (dto.translations ?? undefined) as Prisma.InputJsonValue | undefined,
        parentId: dto.parentId ?? null,
      },
    });
    await this.invalidate();
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    await this.ensureExists(id);

    let slug: string | undefined;
    if (dto.slug) {
      slug = await ensureUniqueSlug(dto.slug, (candidate) =>
        this.prisma.category
          .findFirst({ where: { slug: candidate, NOT: { id } }, select: { id: true } })
          .then(Boolean),
      );
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.iconName !== undefined && { iconName: dto.iconName || null }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl || null }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.translations !== undefined && {
          translations: dto.translations as Prisma.InputJsonValue,
        }),
        ...(dto.parentId !== undefined && { parentId: dto.parentId || null }),
      },
    });
    await this.invalidate();
    return category;
  }

  /** Soft-blocks deletion while active services reference the category. */
  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    const activeServices = await this.prisma.service.count({
      where: { categoryId: id, deletedAt: null, status: 'ACTIVE' },
    });
    if (activeServices > 0) {
      throw new BusinessRuleException(
        `Cannot delete a category with ${activeServices} active service(s)`,
      );
    }
    await this.prisma.category.delete({ where: { id } });
    await this.invalidate();
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.prisma.category.findUnique({ where: { id }, select: { id: true } });
    if (!found) throw new NotFoundException('Category not found');
  }

  private async invalidate(): Promise<void> {
    await this.cache.del(CACHE_KEYS.activeList);
  }
}

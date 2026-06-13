import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { FilterQuery, Model } from 'mongoose';
import { Category, CategoryDocument } from '../../database/schemas/category.schema';
import { Service, ServiceDocument } from '../../database/schemas/service.schema';
import { ServiceStatus } from '../../common/enums';
import { toRecord } from '../../database/schemas/schema.helpers';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { ensureUniqueSlug } from '../../common/utils/slug.util';
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

export interface CategoryRecord {
  id: string;
  slug: string;
  name: string;
  type: string;
  iconName?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  translations?: Record<string, unknown> | null;
  parentId?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

/** Shape returned for public consumption with the localized name resolved. */
export interface CategoryView extends CategoryRecord {
  localizedName: string;
}

const categoryRecord = (
  doc: { _id: { toString(): string } } & Record<string, unknown>,
): CategoryRecord => toRecord<Omit<CategoryRecord, 'id'>>(doc);

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private localize(category: CategoryRecord, locale: Locale): CategoryView {
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
      const cached = await this.cache.get<CategoryRecord[]>(CACHE_KEYS.activeList);
      const rows =
        cached ??
        (await this.categoryModel.find({ isActive: true }).sort({ sortOrder: 'asc' }).lean().exec()).map(
          (c) => categoryRecord(c),
        );
      if (!cached) await this.cache.set(CACHE_KEYS.activeList, rows);
      return rows.map((c) => this.localize(c, loc));
    }

    const where: FilterQuery<CategoryDocument> = {};
    if (!query.includeInactive) where.isActive = true;
    if (query.type) where.type = query.type;
    const rows = await this.categoryModel.find(where).sort({ sortOrder: 'asc' }).lean().exec();
    return rows.map((c) => this.localize(categoryRecord(c), loc));
  }

  async getBySlug(slug: string, locale?: string): Promise<CategoryView> {
    const category = await this.categoryModel.findOne({ slug }).lean().exec();
    if (!category) throw new NotFoundException('Category not found');
    return this.localize(categoryRecord(category), normalizeLocale(locale));
  }

  async create(dto: CreateCategoryDto): Promise<CategoryRecord> {
    const slug = await ensureUniqueSlug(dto.slug ?? dto.name, (candidate) =>
      this.categoryModel.exists({ slug: candidate }).then(Boolean),
    );
    const category = await this.categoryModel.create({
      slug,
      name: dto.name.trim(),
      type: dto.type,
      iconName: dto.iconName ?? null,
      imageUrl: dto.imageUrl ?? null,
      sortOrder: dto.sortOrder ?? 0,
      isActive: dto.isActive ?? true,
      translations: dto.translations ?? undefined,
      parentId: dto.parentId ?? null,
    });
    await this.invalidate();
    return categoryRecord(category.toObject() as never);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryRecord> {
    await this.ensureExists(id);

    let slug: string | undefined;
    if (dto.slug) {
      slug = await ensureUniqueSlug(dto.slug, (candidate) =>
        this.categoryModel.exists({ slug: candidate, _id: { $ne: id } }).then(Boolean),
      );
    }

    const patch: Record<string, unknown> = {};
    if (slug) patch.slug = slug;
    if (dto.name !== undefined) patch.name = dto.name.trim();
    if (dto.type !== undefined) patch.type = dto.type;
    if (dto.iconName !== undefined) patch.iconName = dto.iconName || null;
    if (dto.imageUrl !== undefined) patch.imageUrl = dto.imageUrl || null;
    if (dto.sortOrder !== undefined) patch.sortOrder = dto.sortOrder;
    if (dto.isActive !== undefined) patch.isActive = dto.isActive;
    if (dto.translations !== undefined) patch.translations = dto.translations;
    if (dto.parentId !== undefined) patch.parentId = dto.parentId || null;

    const category = await this.categoryModel
      .findByIdAndUpdate(id, { $set: patch }, { new: true })
      .lean()
      .exec();
    if (!category) throw new NotFoundException('Category not found');
    await this.invalidate();
    return categoryRecord(category);
  }

  /** Soft-blocks deletion while active services reference the category. */
  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    const activeServices = await this.serviceModel.countDocuments({
      categoryId: id,
      deletedAt: null,
      status: ServiceStatus.ACTIVE,
    });
    if (activeServices > 0) {
      throw new BusinessRuleException(
        `Cannot delete a category with ${activeServices} active service(s)`,
      );
    }
    await this.categoryModel.deleteOne({ _id: id });
    await this.invalidate();
  }

  private async ensureExists(id: string): Promise<void> {
    const found = await this.categoryModel.exists({ _id: id });
    if (!found) throw new NotFoundException('Category not found');
  }

  private async invalidate(): Promise<void> {
    await this.cache.del(CACHE_KEYS.activeList);
  }
}

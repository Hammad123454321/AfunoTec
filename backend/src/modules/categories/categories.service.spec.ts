import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import { CategoryDocument } from '../../database/schemas/category.schema';
import { ServiceDocument } from '../../database/schemas/service.schema';
import { CategoryType } from '../../common/enums';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { CategoriesService } from './categories.service';

function categoryDoc(overrides: Record<string, unknown> = {}) {
  const _id = new Types.ObjectId();
  const base = {
    slug: 'stays',
    name: 'Stays',
    type: 'STAY',
    iconName: null,
    imageUrl: null,
    sortOrder: 0,
    isActive: true,
    translations: { fr: { name: 'Séjours' } },
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
  return { _id, ...base, toObject: () => ({ _id, ...base }) };
}

function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'lean']) chain[m] = jest.fn().mockReturnValue(chain);
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

describe('CategoriesService', () => {
  let categoryModel: DeepMockProxy<Model<CategoryDocument>>;
  let serviceModel: DeepMockProxy<Model<ServiceDocument>>;
  let cache: DeepMockProxy<Cache>;
  let service: CategoriesService;

  beforeEach(() => {
    categoryModel = mockDeep<Model<CategoryDocument>>();
    serviceModel = mockDeep<Model<ServiceDocument>>();
    cache = mockDeep<Cache>();
    service = new CategoriesService(categoryModel, serviceModel, cache);
  });

  describe('list', () => {
    it('serves the active list from cache when present (no DB hit)', async () => {
      cache.get.mockResolvedValue([{ id: 'c1', slug: 'stays', name: 'Stays', translations: { fr: { name: 'Séjours' } } }]);
      const res = await service.list({});
      expect(categoryModel.find).not.toHaveBeenCalled();
      expect(res[0].localizedName).toBe('Stays'); // default locale en -> canonical name
    });

    it('resolves the localized name for the requested locale', async () => {
      cache.get.mockResolvedValue([{ id: 'c1', slug: 'stays', name: 'Stays', translations: { fr: { name: 'Séjours' } } }]);
      const res = await service.list({}, 'fr');
      expect(res[0].localizedName).toBe('Séjours');
    });

    it('caches the active list on a miss', async () => {
      cache.get.mockResolvedValue(undefined);
      categoryModel.find.mockReturnValue(queryChain([categoryDoc()]) as never);
      await service.list({});
      expect(cache.set).toHaveBeenCalledWith('categories:active', expect.any(Array));
    });

    it('bypasses cache for filtered (type) queries', async () => {
      categoryModel.find.mockReturnValue(queryChain([]) as never);
      await service.list({ type: CategoryType.TOUR });
      expect(cache.get).not.toHaveBeenCalled();
      const filter = (categoryModel.find.mock.calls[0] as unknown[])[0];
      expect(filter).toMatchObject({ isActive: true, type: CategoryType.TOUR });
    });
  });

  describe('create', () => {
    it('auto-generates a unique slug and invalidates the cache', async () => {
      categoryModel.exists.mockResolvedValue(null); // slug free
      categoryModel.create.mockResolvedValue(categoryDoc({ slug: 'beaches' }) as never);
      await service.create({ name: 'Beaches', type: CategoryType.THING_TO_DO });
      expect(categoryModel.create).toHaveBeenCalled();
      expect(cache.del).toHaveBeenCalledWith('categories:active');
    });
  });

  describe('remove', () => {
    it('refuses deletion when active services reference the category (422)', async () => {
      categoryModel.exists.mockResolvedValue({ _id: 'c1' } as never);
      serviceModel.countDocuments.mockResolvedValue(3 as never);
      await expect(service.remove('c1')).rejects.toBeInstanceOf(BusinessRuleException);
      expect(categoryModel.deleteOne).not.toHaveBeenCalled();
    });

    it('deletes and invalidates cache when no active services exist', async () => {
      categoryModel.exists.mockResolvedValue({ _id: 'c1' } as never);
      serviceModel.countDocuments.mockResolvedValue(0 as never);
      categoryModel.deleteOne.mockResolvedValue({} as never);
      await service.remove('c1');
      expect(categoryModel.deleteOne).toHaveBeenCalledWith({ _id: 'c1' });
      expect(cache.del).toHaveBeenCalledWith('categories:active');
    });

    it('throws NotFound for a missing category', async () => {
      categoryModel.exists.mockResolvedValue(null);
      await expect(service.remove('nope')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

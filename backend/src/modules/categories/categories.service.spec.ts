import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { CategoriesService } from './categories.service';

function category(overrides: Partial<any> = {}) {
  return {
    id: 'c1',
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
}

describe('CategoriesService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let cache: DeepMockProxy<Cache>;
  let service: CategoriesService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    cache = mockDeep<Cache>();
    service = new CategoriesService(prisma, cache);
  });

  describe('list', () => {
    it('serves the active list from cache when present (no DB hit)', async () => {
      cache.get.mockResolvedValue([category()]);
      const res = await service.list({});
      expect(prisma.category.findMany).not.toHaveBeenCalled();
      expect(res[0].localizedName).toBe('Stays'); // default locale en -> canonical name
    });

    it('resolves the localized name for the requested locale', async () => {
      cache.get.mockResolvedValue([category()]);
      const res = await service.list({}, 'fr');
      expect(res[0].localizedName).toBe('Séjours');
    });

    it('caches the active list on a miss', async () => {
      cache.get.mockResolvedValue(undefined);
      prisma.category.findMany.mockResolvedValue([category()] as any);
      await service.list({});
      expect(cache.set).toHaveBeenCalledWith('categories:active', expect.any(Array));
    });

    it('bypasses cache for filtered (type) queries', async () => {
      prisma.category.findMany.mockResolvedValue([] as any);
      await service.list({ type: 'TOUR' as any });
      expect(cache.get).not.toHaveBeenCalled();
      const arg = (prisma.category.findMany as jest.Mock).mock.calls[0][0];
      expect(arg.where).toMatchObject({ isActive: true, type: 'TOUR' });
    });
  });

  describe('create', () => {
    it('auto-generates a unique slug and invalidates the cache', async () => {
      prisma.category.findUnique.mockResolvedValue(null); // slug free
      prisma.category.create.mockResolvedValue(category({ slug: 'beaches' }) as any);
      await service.create({ name: 'Beaches', type: 'THING_TO_DO' as any });
      expect(prisma.category.create).toHaveBeenCalled();
      expect(cache.del).toHaveBeenCalledWith('categories:active');
    });
  });

  describe('remove', () => {
    it('refuses deletion when active services reference the category (422)', async () => {
      prisma.category.findUnique.mockResolvedValue({ id: 'c1' } as any);
      prisma.service.count.mockResolvedValue(3);
      await expect(service.remove('c1')).rejects.toBeInstanceOf(BusinessRuleException);
      expect(prisma.category.delete).not.toHaveBeenCalled();
    });

    it('deletes and invalidates cache when no active services exist', async () => {
      prisma.category.findUnique.mockResolvedValue({ id: 'c1' } as any);
      prisma.service.count.mockResolvedValue(0);
      prisma.category.delete.mockResolvedValue(category() as any);
      await service.remove('c1');
      expect(prisma.category.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
      expect(cache.del).toHaveBeenCalledWith('categories:active');
    });

    it('throws NotFound for a missing category', async () => {
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(service.remove('nope')).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});

import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TagsService } from './tags.service';

function tag(overrides: Partial<any> = {}) {
  return {
    id: 't1',
    slug: 'family',
    name: 'Family',
    translations: { fr: { name: 'Familial' } },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('TagsService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let cache: DeepMockProxy<Cache>;
  let service: TagsService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    cache = mockDeep<Cache>();
    service = new TagsService(prisma, cache);
  });

  it('serves the list from cache and localizes by locale', async () => {
    cache.get.mockResolvedValue([tag()]);
    const res = await service.list('fr');
    expect(prisma.tag.findMany).not.toHaveBeenCalled();
    expect(res[0].localizedName).toBe('Familial');
  });

  it('caches on a miss', async () => {
    cache.get.mockResolvedValue(undefined);
    prisma.tag.findMany.mockResolvedValue([tag()] as any);
    await service.list();
    expect(cache.set).toHaveBeenCalledWith('tags:all', expect.any(Array));
  });

  it('creates with an auto slug and invalidates cache', async () => {
    prisma.tag.findUnique.mockResolvedValue(null);
    prisma.tag.create.mockResolvedValue(tag() as any);
    await service.create({ name: 'Family' });
    expect(cache.del).toHaveBeenCalledWith('tags:all');
  });

  it('removes and invalidates cache', async () => {
    prisma.tag.findUnique.mockResolvedValue({ id: 't1' } as any);
    prisma.tag.delete.mockResolvedValue(tag() as any);
    await service.remove('t1');
    expect(prisma.tag.delete).toHaveBeenCalledWith({ where: { id: 't1' } });
    expect(cache.del).toHaveBeenCalledWith('tags:all');
  });

  it('throws NotFound when removing a missing tag', async () => {
    prisma.tag.findUnique.mockResolvedValue(null);
    await expect(service.remove('nope')).rejects.toBeInstanceOf(NotFoundException);
  });
});

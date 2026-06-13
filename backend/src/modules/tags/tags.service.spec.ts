import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import { TagDocument } from '../../database/schemas/tag.schema';
import { ServiceDocument } from '../../database/schemas/service.schema';
import { TagsService } from './tags.service';

function tagDoc(overrides: Record<string, unknown> = {}) {
  const _id = new Types.ObjectId();
  const base = {
    slug: 'family',
    name: 'Family',
    translations: { fr: { name: 'Familial' } },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
  return { _id, ...base, toObject: () => ({ _id, ...base }) };
}

/** Chainable query stub resolving to `value` at exec(). */
function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'lean']) chain[m] = jest.fn().mockReturnValue(chain);
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

describe('TagsService', () => {
  let tagModel: DeepMockProxy<Model<TagDocument>>;
  let serviceModel: DeepMockProxy<Model<ServiceDocument>>;
  let cache: DeepMockProxy<Cache>;
  let service: TagsService;

  beforeEach(() => {
    tagModel = mockDeep<Model<TagDocument>>();
    serviceModel = mockDeep<Model<ServiceDocument>>();
    cache = mockDeep<Cache>();
    service = new TagsService(tagModel, serviceModel, cache);
  });

  it('serves the list from cache and localizes by locale', async () => {
    cache.get.mockResolvedValue([{ id: 't1', slug: 'family', name: 'Family', translations: { fr: { name: 'Familial' } } }]);
    const res = await service.list('fr');
    expect(tagModel.find).not.toHaveBeenCalled();
    expect(res[0].localizedName).toBe('Familial');
  });

  it('caches on a miss', async () => {
    cache.get.mockResolvedValue(undefined);
    tagModel.find.mockReturnValue(queryChain([tagDoc()]) as never);
    await service.list();
    expect(cache.set).toHaveBeenCalledWith('tags:all', expect.any(Array));
  });

  it('creates with an auto slug and invalidates cache', async () => {
    tagModel.exists.mockResolvedValue(null);
    tagModel.create.mockResolvedValue(tagDoc() as never);
    await service.create({ name: 'Family' });
    expect(cache.del).toHaveBeenCalledWith('tags:all');
  });

  it('removes, pulls the tag from services, and invalidates cache', async () => {
    tagModel.exists.mockResolvedValue({ _id: 't1' } as never);
    tagModel.deleteOne.mockResolvedValue({} as never);
    serviceModel.updateMany.mockResolvedValue({} as never);
    await service.remove('t1');
    expect(tagModel.deleteOne).toHaveBeenCalledWith({ _id: 't1' });
    expect(serviceModel.updateMany).toHaveBeenCalledWith({ tags: 't1' }, { $pull: { tags: 't1' } });
    expect(cache.del).toHaveBeenCalledWith('tags:all');
  });

  it('throws NotFound when removing a missing tag', async () => {
    tagModel.exists.mockResolvedValue(null);
    await expect(service.remove('nope')).rejects.toBeInstanceOf(NotFoundException);
  });
});

import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import { LocaleStringDocument } from '../../database/schemas/locale-string.schema';
import { LocaleStringsService } from './locale-strings.service';

const row = (key: string, t: Record<string, string>, category: string | null = null) => ({
  _id: new Types.ObjectId(),
  key,
  translations: t,
  category,
  updatedAt: new Date(),
});

/** Chainable query stub resolving to `value` at exec(). */
function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'lean']) chain[m] = jest.fn().mockReturnValue(chain);
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

describe('LocaleStringsService', () => {
  let localeStringModel: DeepMockProxy<Model<LocaleStringDocument>>;
  let cache: DeepMockProxy<Cache>;
  let service: LocaleStringsService;

  beforeEach(() => {
    localeStringModel = mockDeep<Model<LocaleStringDocument>>();
    cache = mockDeep<Cache>();
    service = new LocaleStringsService(localeStringModel, cache);
  });

  it('returns a key→translations map from cache when present', async () => {
    cache.get.mockResolvedValue([row('home.title', { en: 'Hi', fr: 'Salut' })] as never);
    const map = await service.getStrings();
    expect(localeStringModel.find).not.toHaveBeenCalled();
    expect(map['home.title']).toEqual({ en: 'Hi', fr: 'Salut' });
  });

  it('bypasses cache when filtering by category', async () => {
    localeStringModel.find.mockReturnValue(
      queryChain([row('checkout.pay', { en: 'Pay' }, 'checkout')]) as never,
    );
    const map = await service.getStrings('checkout');
    expect(cache.get).not.toHaveBeenCalled();
    expect(map['checkout.pay']).toEqual({ en: 'Pay' });
  });

  it('upserts and invalidates the cache', async () => {
    localeStringModel.findOneAndUpdate.mockReturnValue(queryChain(row('a.b', { en: 'x' })) as never);
    await service.upsert({ key: 'a.b', translations: { en: 'x' } });
    expect(cache.del).toHaveBeenCalledWith('i18n:strings');
  });
});

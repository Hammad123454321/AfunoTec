import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LocaleStringsService } from './locale-strings.service';

const row = (key: string, t: Record<string, string>, category: string | null = null) => ({
  id: key,
  key,
  translations: t,
  category,
  updatedAt: new Date(),
});

describe('LocaleStringsService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let cache: DeepMockProxy<Cache>;
  let service: LocaleStringsService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    cache = mockDeep<Cache>();
    service = new LocaleStringsService(prisma, cache);
  });

  it('returns a key→translations map from cache when present', async () => {
    cache.get.mockResolvedValue([row('home.title', { en: 'Hi', fr: 'Salut' })] as any);
    const map = await service.getStrings();
    expect(prisma.localeString.findMany).not.toHaveBeenCalled();
    expect(map['home.title']).toEqual({ en: 'Hi', fr: 'Salut' });
  });

  it('bypasses cache when filtering by category', async () => {
    prisma.localeString.findMany.mockResolvedValue([row('checkout.pay', { en: 'Pay' }, 'checkout')] as any);
    const map = await service.getStrings('checkout');
    expect(cache.get).not.toHaveBeenCalled();
    expect(map['checkout.pay']).toEqual({ en: 'Pay' });
  });

  it('upserts and invalidates the cache', async () => {
    prisma.localeString.upsert.mockResolvedValue(row('a.b', { en: 'x' }) as any);
    await service.upsert({ key: 'a.b', translations: { en: 'x' } });
    expect(cache.del).toHaveBeenCalledWith('i18n:strings');
  });
});

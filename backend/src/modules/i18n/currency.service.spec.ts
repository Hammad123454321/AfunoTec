import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CurrencyService } from './currency.service';
import { FxProviderService } from './fx-provider.service';

function ccy(code: string, rate: number, isActive = true) {
  return { code, name: code, symbol: code, rateToMga: new Prisma.Decimal(rate), isActive };
}

describe('CurrencyService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let fx: DeepMockProxy<FxProviderService>;
  let cache: DeepMockProxy<Cache>;
  let service: CurrencyService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    fx = mockDeep<FxProviderService>();
    cache = mockDeep<Cache>();
    const config = { get: (k: string) => (k === 'fx.baseCurrency' ? 'MGA' : undefined) } as unknown as ConfigService;
    service = new CurrencyService(prisma, fx, config, cache);
  });

  describe('listActive', () => {
    it('serves from cache and serializes rateToMga as a string', async () => {
      cache.get.mockResolvedValue([ccy('USD', 4500)] as any);
      const res = await service.listActive();
      expect(prisma.currency.findMany).not.toHaveBeenCalled();
      expect(res[0].rateToMga).toBe('4500');
      expect(typeof res[0].rateToMga).toBe('string');
    });

    it('caches on a miss', async () => {
      cache.get.mockResolvedValue(undefined);
      prisma.currency.findMany.mockResolvedValue([ccy('USD', 4500)] as any);
      await service.listActive();
      expect(cache.set).toHaveBeenCalledWith('currencies:active', expect.any(Array));
    });
  });

  describe('update', () => {
    it('throws NotFound for an unknown code', async () => {
      prisma.currency.findUnique.mockResolvedValue(null);
      await expect(service.update('XXX', { rateToMga: 1 })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('updates and invalidates cache', async () => {
      prisma.currency.findUnique.mockResolvedValue(ccy('USD', 4500) as any);
      prisma.currency.update.mockResolvedValue(ccy('USD', 4600) as any);
      const res = await service.update('USD', { rateToMga: 4600 });
      expect(res.rateToMga).toBe('4600');
      expect(cache.del).toHaveBeenCalledWith('currencies:active');
    });
  });

  describe('refresh', () => {
    it('is a no-op when the FX provider returns null (disabled/unreachable)', async () => {
      prisma.currency.findMany.mockResolvedValue([ccy('USD', 4500)] as any);
      fx.fetchRates.mockResolvedValue(null);
      const res = await service.refresh();
      expect(res).toEqual({ refreshed: 0, provider: false });
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('updates rates from the provider (never the base) and invalidates cache', async () => {
      prisma.currency.findMany.mockResolvedValue([ccy('MGA', 1), ccy('USD', 4500), ccy('EUR', 4900)] as any);
      fx.fetchRates.mockResolvedValue({ MGA: 1, USD: 4550, EUR: 4950 });
      prisma.$transaction.mockResolvedValue([] as any);

      const res = await service.refresh();
      expect(res).toEqual({ refreshed: 2, provider: true }); // base excluded
      expect(cache.del).toHaveBeenCalledWith('currencies:active');
    });
  });
});

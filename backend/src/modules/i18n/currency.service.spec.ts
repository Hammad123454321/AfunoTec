import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import { CurrencyDocument } from '../../database/schemas/currency.schema';
import { CurrencyService } from './currency.service';
import { FxProviderService } from './fx-provider.service';

/** Lean currency row — the ISO code is the `_id`, rateToMga is Decimal128. */
function ccy(code: string, rate: number, isActive = true) {
  return {
    _id: code,
    name: code,
    symbol: code,
    rateToMga: Types.Decimal128.fromString(String(rate)),
    isActive,
  };
}

/** Chainable query stub resolving to `value` at exec(). */
function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'lean']) chain[m] = jest.fn().mockReturnValue(chain);
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

describe('CurrencyService', () => {
  let currencyModel: DeepMockProxy<Model<CurrencyDocument>>;
  let fx: DeepMockProxy<FxProviderService>;
  let cache: DeepMockProxy<Cache>;
  let service: CurrencyService;

  beforeEach(() => {
    currencyModel = mockDeep<Model<CurrencyDocument>>();
    fx = mockDeep<FxProviderService>();
    cache = mockDeep<Cache>();
    const config = {
      get: (k: string) => (k === 'fx.baseCurrency' ? 'MGA' : undefined),
    } as unknown as ConfigService;
    service = new CurrencyService(currencyModel, fx, config, cache);
  });

  describe('listActive', () => {
    it('serves from cache and serializes rateToMga as a string', async () => {
      cache.get.mockResolvedValue([ccy('USD', 4500)] as never);
      const res = await service.listActive();
      expect(currencyModel.find).not.toHaveBeenCalled();
      expect(res[0].rateToMga).toBe('4500');
      expect(typeof res[0].rateToMga).toBe('string');
    });

    it('caches on a miss', async () => {
      cache.get.mockResolvedValue(undefined);
      currencyModel.find.mockReturnValue(queryChain([ccy('USD', 4500)]) as never);
      await service.listActive();
      expect(cache.set).toHaveBeenCalledWith('currencies:active', expect.any(Array));
    });
  });

  describe('update', () => {
    it('throws NotFound for an unknown code', async () => {
      currencyModel.findById.mockReturnValue(queryChain(null) as never);
      await expect(service.update('XXX', { rateToMga: 1 })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('updates and invalidates cache', async () => {
      currencyModel.findById.mockReturnValue(queryChain(ccy('USD', 4500)) as never);
      currencyModel.findByIdAndUpdate.mockReturnValue(queryChain(ccy('USD', 4600)) as never);
      const res = await service.update('USD', { rateToMga: 4600 });
      expect(res.rateToMga).toBe('4600');
      expect(cache.del).toHaveBeenCalledWith('currencies:active');
    });
  });

  describe('refresh', () => {
    it('is a no-op when the FX provider returns null (disabled/unreachable)', async () => {
      currencyModel.find.mockReturnValue(queryChain([ccy('USD', 4500)]) as never);
      fx.fetchRates.mockResolvedValue(null);
      const res = await service.refresh();
      expect(res).toEqual({ refreshed: 0, provider: false });
      expect(currencyModel.updateOne).not.toHaveBeenCalled();
    });

    it('updates rates from the provider (never the base) and invalidates cache', async () => {
      currencyModel.find.mockReturnValue(
        queryChain([ccy('MGA', 1), ccy('USD', 4500), ccy('EUR', 4900)]) as never,
      );
      fx.fetchRates.mockResolvedValue({ MGA: 1, USD: 4550, EUR: 4950 });
      currencyModel.updateOne.mockReturnValue(queryChain({}) as never);

      const res = await service.refresh();
      expect(res).toEqual({ refreshed: 2, provider: true }); // base excluded
      expect(currencyModel.updateOne).toHaveBeenCalledTimes(2);
      expect(cache.del).toHaveBeenCalledWith('currencies:active');
    });
  });
});

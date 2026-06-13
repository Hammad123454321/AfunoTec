import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { Currency, CurrencyDocument } from '../../database/schemas/currency.schema';
import { toDecimal, toDecimal128 } from '../../common/utils/money.util';
import { FxProviderService } from './fx-provider.service';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

const CACHE_KEY = 'currencies:active';

export interface CurrencyView {
  code: string;
  name: string;
  symbol: string;
  rateToMga: string;
  isActive: boolean;
}

/** Lean/plain shape of a stored currency (the ISO code is the `_id`). */
interface CurrencyRow {
  _id: string;
  name: string;
  symbol: string;
  rateToMga: unknown;
  isActive: boolean;
}

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectModel(Currency.name) private readonly currencyModel: Model<CurrencyDocument>,
    private readonly fx: FxProviderService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private serialize(c: CurrencyRow): CurrencyView {
    return {
      code: c._id,
      name: c.name,
      symbol: c.symbol,
      rateToMga: toDecimal(c.rateToMga as never).toString(),
      isActive: c.isActive,
    };
  }

  /** Public, cached list of active currencies. */
  async listActive(): Promise<CurrencyView[]> {
    const cached = await this.cache.get<CurrencyRow[]>(CACHE_KEY);
    const rows =
      cached ?? (await this.currencyModel.find({ isActive: true }).lean().exec());
    if (!cached) await this.cache.set(CACHE_KEY, rows);
    return (rows as CurrencyRow[]).map((c) => this.serialize(c));
  }

  /** Admin manual override of a currency. */
  async update(code: string, dto: UpdateCurrencyDto): Promise<CurrencyView> {
    const existing = await this.currencyModel.findById(code).lean().exec();
    if (!existing) throw new NotFoundException('Currency not found');

    const patch: Record<string, unknown> = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.symbol !== undefined && { symbol: dto.symbol }),
      ...(dto.rateToMga !== undefined && { rateToMga: toDecimal128(dto.rateToMga) }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    };

    const updated = await this.currencyModel
      .findByIdAndUpdate(code, { $set: patch }, { new: true })
      .lean()
      .exec();
    await this.invalidate();
    return this.serialize(updated as unknown as CurrencyRow);
  }

  /**
   * Refreshes rates from the configured FX provider. No-op (keeps existing
   * rates) when the provider is disabled or unreachable. The base currency
   * (MGA) is never overwritten.
   */
  async refresh(): Promise<{ refreshed: number; provider: boolean }> {
    const currencies = await this.currencyModel.find().lean().exec();
    const codes = (currencies as CurrencyRow[]).map((c) => c._id);
    const rates = await this.fx.fetchRates(codes);

    if (!rates) {
      this.logger.log('FX provider disabled/unavailable — rates unchanged');
      return { refreshed: 0, provider: false };
    }

    const base = this.configService.get<string>('fx.baseCurrency') ?? 'MGA';
    const updates = Object.entries(rates).filter(
      ([code, rate]) => code !== base && rate > 0,
    );
    await Promise.all(
      updates.map(([code, rate]) =>
        this.currencyModel
          .updateOne({ _id: code }, { $set: { rateToMga: toDecimal128(rate) } })
          .exec(),
      ),
    );
    const refreshed = updates.length;
    await this.invalidate();
    this.logger.log(`Refreshed ${refreshed} currency rate(s)`);
    return { refreshed, provider: true };
  }

  /** Scheduled daily FX refresh (no-op when the provider is disabled). */
  @Cron(process.env.FX_REFRESH_CRON ?? '0 3 * * *', { name: 'fx-refresh' })
  async scheduledRefresh(): Promise<void> {
    if (!this.fx.enabled) return;
    await this.refresh().catch((err) =>
      this.logger.warn(`Scheduled FX refresh failed: ${err?.message ?? 'unknown'}`),
    );
  }

  private async invalidate(): Promise<void> {
    await this.cache.del(CACHE_KEY);
  }
}

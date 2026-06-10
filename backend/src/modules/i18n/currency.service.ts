import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { Currency, Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { FxProviderService } from './fx-provider.service';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

const CACHE_KEY = 'currencies:active';

export interface CurrencyView extends Omit<Currency, 'rateToMga'> {
  rateToMga: string;
}

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fx: FxProviderService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  private serialize(c: Currency): CurrencyView {
    return { ...c, rateToMga: c.rateToMga.toString() };
  }

  /** Public, cached list of active currencies. */
  async listActive(): Promise<CurrencyView[]> {
    const cached = await this.cache.get<Currency[]>(CACHE_KEY);
    const rows = cached ?? (await this.prisma.currency.findMany({ where: { isActive: true } }));
    if (!cached) await this.cache.set(CACHE_KEY, rows);
    return rows.map((c) => this.serialize(c));
  }

  /** Admin manual override of a currency. */
  async update(code: string, dto: UpdateCurrencyDto): Promise<CurrencyView> {
    const existing = await this.prisma.currency.findUnique({ where: { code } });
    if (!existing) throw new NotFoundException('Currency not found');

    const updated = await this.prisma.currency.update({
      where: { code },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.symbol !== undefined && { symbol: dto.symbol }),
        ...(dto.rateToMga !== undefined && { rateToMga: new Prisma.Decimal(dto.rateToMga) }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
    await this.invalidate();
    return this.serialize(updated);
  }

  /**
   * Refreshes rates from the configured FX provider. No-op (keeps existing
   * rates) when the provider is disabled or unreachable. The base currency
   * (MGA) is never overwritten.
   */
  async refresh(): Promise<{ refreshed: number; provider: boolean }> {
    const currencies = await this.prisma.currency.findMany();
    const codes = currencies.map((c) => c.code);
    const rates = await this.fx.fetchRates(codes);

    if (!rates) {
      this.logger.log('FX provider disabled/unavailable — rates unchanged');
      return { refreshed: 0, provider: false };
    }

    const base = this.configService.get<string>('fx.baseCurrency') ?? 'MGA';
    let refreshed = 0;
    await this.prisma.$transaction(
      Object.entries(rates)
        .filter(([code, rate]) => code !== base && rate > 0)
        .map(([code, rate]) => {
          refreshed += 1;
          return this.prisma.currency.update({
            where: { code },
            data: { rateToMga: new Prisma.Decimal(rate) },
          });
        }),
    );
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

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/** Map of ISO code → value of 1 unit in MGA (rateToMga). */
export type FxRates = Record<string, number>;

/**
 * Pluggable FX rate source. Returns rates expressed as rateToMga for the given
 * currency codes. When no provider/URL is configured it returns null (the
 * caller then keeps the existing stored rates — a safe no-op).
 *
 * Supported providers:
 *   - exchangerate-host: free, base-switchable API.
 *   - none (default): disabled.
 */
@Injectable()
export class FxProviderService {
  private readonly logger = new Logger(FxProviderService.name);

  constructor(private readonly config: ConfigService) {}

  get enabled(): boolean {
    const provider = this.config.get<string>('fx.provider');
    const url = this.config.get<string>('fx.apiUrl');
    return !!provider && provider !== 'none' && !!url;
  }

  /**
   * Fetches rateToMga for each requested code. Returns null when disabled or on
   * any provider error, so the refresh becomes a no-op and rates are preserved.
   */
  async fetchRates(codes: string[]): Promise<FxRates | null> {
    if (!this.enabled) return null;
    const provider = this.config.get<string>('fx.provider');
    try {
      if (provider === 'exchangerate-host') {
        return await this.fetchFromExchangerateHost(codes);
      }
      this.logger.warn(`Unknown FX provider "${provider}" — skipping refresh`);
      return null;
    } catch (err) {
      this.logger.warn(
        `FX refresh failed; keeping existing rates: ${
          err instanceof Error ? err.message : 'unknown error'
        }`,
      );
      return null;
    }
  }

  /**
   * exchangerate-host returns how many units of each symbol equal 1 base unit.
   * With base=MGA, `rates[USD]` = USD per 1 MGA, so rateToMga = 1 / rates[USD].
   */
  private async fetchFromExchangerateHost(codes: string[]): Promise<FxRates> {
    const base = this.config.get<string>('fx.baseCurrency') ?? 'MGA';
    const apiUrl = this.config.get<string>('fx.apiUrl');
    const apiKey = this.config.get<string>('fx.apiKey');
    const symbols = codes.filter((c) => c !== base).join(',');

    const { data } = await axios.get(apiUrl as string, {
      params: { base, symbols, ...(apiKey ? { access_key: apiKey } : {}) },
      timeout: 10_000,
    });

    const rates = (data?.rates ?? {}) as Record<string, number>;
    const out: FxRates = { [base]: 1 };
    for (const code of codes) {
      if (code === base) continue;
      const perBase = rates[code];
      if (typeof perBase === 'number' && perBase > 0) {
        out[code] = 1 / perBase;
      }
    }
    return out;
  }
}

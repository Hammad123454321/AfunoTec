import { registerAs } from '@nestjs/config';

/**
 * Foreign-exchange rate provider configuration.
 *
 * `provider` selects the adapter used by the scheduled FX refresh job.
 * When `apiUrl` is empty the refresh is a no-op that keeps the last known
 * rates (so dev/CI never crash and the system goes live the moment the
 * client supplies a provider + key).
 *
 * Base currency is MGA; all rates are stored as `rateToMga` on the
 * `Currency` table.
 */
export const fxConfig = registerAs('fx', () => ({
  provider: process.env.FX_PROVIDER ?? 'none', // none | exchangerate-host | openexchangerates
  apiUrl: process.env.FX_API_URL ?? '',
  apiKey: process.env.FX_API_KEY ?? '',
  baseCurrency: process.env.FX_BASE_CURRENCY ?? 'MGA',
  // Cron expression for the scheduled refresh (default: daily at 03:00 UTC).
  cron: process.env.FX_REFRESH_CRON ?? '0 3 * * *',
}));

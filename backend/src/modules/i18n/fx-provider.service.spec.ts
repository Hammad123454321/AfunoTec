import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { FxProviderService } from './fx-provider.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

function makeConfig(values: Record<string, unknown>): ConfigService {
  return { get: (k: string) => values[k] } as unknown as ConfigService;
}

describe('FxProviderService', () => {
  afterEach(() => jest.clearAllMocks());

  it('is disabled (and returns null) when no provider/url is configured', async () => {
    const svc = new FxProviderService(makeConfig({ 'fx.provider': 'none', 'fx.apiUrl': '' }));
    expect(svc.enabled).toBe(false);
    await expect(svc.fetchRates(['USD'])).resolves.toBeNull();
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('converts exchangerate-host per-base rates into rateToMga', async () => {
    const svc = new FxProviderService(
      makeConfig({
        'fx.provider': 'exchangerate-host',
        'fx.apiUrl': 'https://api.example/latest',
        'fx.baseCurrency': 'MGA',
        'fx.apiKey': '',
      }),
    );
    // 1 MGA = 0.00022 USD → rateToMga(USD) = 1/0.00022 ≈ 4545.45
    mockedAxios.get.mockResolvedValue({ data: { rates: { USD: 0.00022, EUR: 0.0002 } } });

    const rates = await svc.fetchRates(['MGA', 'USD', 'EUR']);
    expect(rates).not.toBeNull();
    expect(rates!.MGA).toBe(1);
    expect(Math.round(rates!.USD)).toBe(4545);
    expect(Math.round(rates!.EUR)).toBe(5000);
  });

  it('returns null on a provider error (so the caller keeps existing rates)', async () => {
    const svc = new FxProviderService(
      makeConfig({ 'fx.provider': 'exchangerate-host', 'fx.apiUrl': 'https://api.example/latest' }),
    );
    mockedAxios.get.mockRejectedValue(new Error('network down'));
    await expect(svc.fetchRates(['USD'])).resolves.toBeNull();
  });
});

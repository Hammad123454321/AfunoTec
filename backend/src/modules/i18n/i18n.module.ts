import { Module } from '@nestjs/common';
import { CurrenciesController, I18nController } from './i18n.controller';
import { CurrencyService } from './currency.service';
import { LocaleStringsService } from './locale-strings.service';
import { FxProviderService } from './fx-provider.service';

/**
 * Currencies (cached public list, admin override, FX refresh + daily cron) and
 * admin-editable UI strings (cached public map, admin upsert). ConfigModule,
 * CacheModule and ScheduleModule are global.
 */
@Module({
  controllers: [CurrenciesController, I18nController],
  providers: [CurrencyService, LocaleStringsService, FxProviderService],
  exports: [CurrencyService, LocaleStringsService],
})
export class I18nModule {}

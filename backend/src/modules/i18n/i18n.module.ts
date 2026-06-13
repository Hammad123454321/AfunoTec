import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrenciesController, I18nController } from './i18n.controller';
import { CurrencyService } from './currency.service';
import { LocaleStringsService } from './locale-strings.service';
import { FxProviderService } from './fx-provider.service';
import { Currency, CurrencySchema } from '../../database/schemas/currency.schema';
import { LocaleString, LocaleStringSchema } from '../../database/schemas/locale-string.schema';

/**
 * Currencies (cached public list, admin override, FX refresh + daily cron) and
 * admin-editable UI strings (cached public map, admin upsert). ConfigModule,
 * CacheModule and ScheduleModule are global.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Currency.name, schema: CurrencySchema },
      { name: LocaleString.name, schema: LocaleStringSchema },
    ]),
  ],
  controllers: [CurrenciesController, I18nController],
  providers: [CurrencyService, LocaleStringsService, FxProviderService],
  exports: [CurrencyService, LocaleStringsService],
})
export class I18nModule {}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { CurrencyService } from './currency.service';
import { LocaleStringsService } from './locale-strings.service';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { UpsertLocaleStringDto } from './dto/upsert-locale-string.dto';

@ApiTags('currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currency: CurrencyService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List active currencies with rateToMga (public, cached)' })
  list() {
    return this.currency.listActive();
  }

  @Patch(':code')
  @ApiBearerAuth()
  @Roles('ADMIN')
  @Audit({ action: 'UPDATE', entity: 'Currency', idParam: 'code' })
  @ApiOperation({ summary: 'Update a currency (admin)' })
  update(@Param('code') code: string, @Body() dto: UpdateCurrencyDto) {
    return this.currency.update(code.toUpperCase(), dto);
  }

  @Post('refresh')
  @ApiBearerAuth()
  @Roles('ADMIN')
  @Audit({ action: 'FX_REFRESH', entity: 'Currency' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger an FX rate refresh (admin)' })
  refresh() {
    return this.currency.refresh();
  }
}

@ApiTags('i18n')
@Controller('i18n')
export class I18nController {
  constructor(private readonly strings: LocaleStringsService) {}

  @Get('strings')
  @Public()
  @ApiOperation({ summary: 'Get admin-editable UI strings (public, cached)' })
  getStrings(@Query('category') category?: string) {
    return this.strings.getStrings(category);
  }

  @Post('strings')
  @ApiBearerAuth()
  @Roles('ADMIN')
  @Audit({ action: 'UPSERT', entity: 'LocaleString' })
  @ApiOperation({ summary: 'Create or update a UI string (admin)' })
  upsert(@Body() dto: UpsertLocaleStringDto) {
    return this.strings.upsert(dto);
  }
}

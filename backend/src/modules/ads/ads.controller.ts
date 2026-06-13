import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { AdsService, CreateAdDto, UpdateAdDto } from './ads.service';
import { AdPlacement } from '../../common/enums';

@ApiTags('Ads')
@Controller()
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  // ─── Banners ─────────────────────────────────────────────────────────────

  @Get('ads')
  @Public()
  @ApiOperation({ summary: 'Active banners for a placement' })
  @ApiQuery({ name: 'placement', enum: AdPlacement, required: false })
  listAds(@Query('placement') placement?: AdPlacement) {
    return this.adsService.listActive(placement);
  }

  @Post('ads')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'CREATE', entity: 'AdBanner' })
  @ApiOperation({ summary: 'Create a banner (ADMIN/MANAGER)' })
  createAd(@Body() dto: CreateAdDto) {
    return this.adsService.create(dto);
  }

  @Patch('ads/:id')
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'UPDATE', entity: 'AdBanner' })
  @ApiOperation({ summary: 'Update a banner (ADMIN/MANAGER)' })
  updateAd(@Param('id') id: string, @Body() dto: UpdateAdDto) {
    return this.adsService.update(id, dto);
  }

  @Delete('ads/:id')
  @ApiBearerAuth()
  @Roles('ADMIN')
  @Audit({ action: 'DEACTIVATE', entity: 'AdBanner' })
  @ApiOperation({ summary: 'Deactivate a banner (ADMIN)' })
  deactivateAd(@Param('id') id: string) {
    return this.adsService.deactivate(id);
  }

  // ─── Homepage showcases ───────────────────────────────────────────────────

  @Get('homepage-showcases')
  @Public()
  @ApiOperation({ summary: 'All active homepage showcase slots' })
  listShowcases() {
    return this.adsService.listShowcases();
  }

  @Put('homepage-showcases/:slot')
  @ApiBearerAuth()
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'UPDATE', entity: 'HomepageShowcase' })
  @ApiOperation({ summary: 'Replace a showcase slot (ADMIN/MANAGER)' })
  upsertShowcase(@Param('slot') slot: string, @Body('items') items: unknown[]) {
    return this.adsService.upsertShowcase(slot, items);
  }
}

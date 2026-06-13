import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { AnalyticsService, AnalyticsEvent } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  @HttpCode(HttpStatus.ACCEPTED)
  @Public()
  @ApiOperation({ summary: 'Batch event ingestion (client-side tracking)' })
  ingestEvents(@Body('events') events: AnalyticsEvent[]) {
    return this.analyticsService.ingestEvents(events ?? []);
  }

  @Get('integration-config')
  @ApiBearerAuth()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get analytics integration IDs (GA, FB Pixel, Hotjar)' })
  getConfig() {
    return this.analyticsService.getIntegrationConfig();
  }

  @Put('integration-config')
  @ApiBearerAuth()
  @Roles('ADMIN')
  @Audit({ action: 'UPDATE', entity: 'AnalyticsSetting' })
  @ApiOperation({ summary: 'Update analytics integration config (ADMIN)' })
  updateConfig(@Body() dto: { googleAnalyticsId?: string; facebookPixelId?: string; hotjarId?: string }) {
    return this.analyticsService.updateIntegrationConfig(dto);
  }
}

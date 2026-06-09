import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { OwnsResource } from '../../common/decorators/owns-resource.decorator';
import { AvailabilityService } from './availability.service';
import { OverrideDayDto, QueryRangeDto, SetAvailabilityDto } from './dto/availability.dto';

@ApiTags('availability')
@Controller('services/:id/availability')
export class AvailabilityController {
  constructor(private readonly availability: AvailabilityService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Per-day availability over a date range (public)' })
  range(@Param('id') id: string, @Query() query: QueryRangeDto) {
    return this.availability.range(id, query.from, query.to);
  }

  @Post()
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER', 'ADMIN')
  @OwnsResource({ model: 'service', param: 'id', providerScoped: true })
  @Audit({ action: 'AVAILABILITY_BULK', entity: 'Service' })
  @ApiOperation({ summary: 'Bulk-set availability across a date range' })
  setRange(@Param('id') id: string, @Body() dto: SetAvailabilityDto) {
    return this.availability.setRange(id, dto);
  }

  @Patch(':date')
  @ApiBearerAuth()
  @Roles('SERVICE_PROVIDER', 'ADMIN')
  @OwnsResource({ model: 'service', param: 'id', providerScoped: true })
  @Audit({ action: 'AVAILABILITY_OVERRIDE', entity: 'Service' })
  @ApiOperation({ summary: 'Override availability for a single day' })
  overrideDay(
    @Param('id') id: string,
    @Param('date') date: string,
    @Body() dto: OverrideDayDto,
  ) {
    return this.availability.overrideDay(id, date, dto);
  }
}

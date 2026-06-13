import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ParseIntPipe as PIP,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { MetricsQueryDto } from './dto/metrics-query.dto';
import { RecentActivityQueryDto } from './dto/recent-activity-query.dto';

@ApiTags('Admin Metrics')
@ApiBearerAuth()
@Roles('ADMIN', 'MANAGER')
@Controller('admin/metrics')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Platform overview: user/service/booking/revenue totals' })
  overview(@Query() dto: MetricsQueryDto) {
    return this.adminService.overview(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Service and booking counts broken down by category' })
  categories(@Query() dto: MetricsQueryDto) {
    return this.adminService.categoryBreakdown(dto);
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Latest audit log entries (newest first)' })
  recentActivity(@Query() dto: RecentActivityQueryDto) {
    return this.adminService.recentActivity(dto);
  }

  @Get('recent-service-owners')
  @ApiOperation({ summary: 'Most recently onboarded service providers' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  recentServiceOwners(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.adminService.recentServiceOwners(limit);
  }
}

@ApiTags('Admin Audit')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin/audit')
export class AdminAuditController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Paginated audit log with filters (ADMIN only)' })
  auditLog(
    @Query('entity') entity?: string,
    @Query('actorId') actorId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.auditLog({ entity, actorId, from, to, page, limit });
  }
}

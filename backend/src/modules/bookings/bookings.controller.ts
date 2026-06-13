import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Idempotent } from '../../common/idempotency/idempotent.decorator';
import { Audit } from '../../common/audit/audit.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { QueryBookingsDto } from './dto/query-bookings.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('CUSTOMER')
  @Idempotent()
  @ApiOperation({ summary: 'Create a booking (idempotent via Idempotency-Key header)' })
  @ApiHeader({ name: 'Idempotency-Key', required: false, description: 'UUID v4 for idempotent submission' })
  create(
    @CurrentUser('id') customerId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(customerId, dto);
  }

  @Get('me')
  @Roles('CUSTOMER')
  @ApiOperation({ summary: 'List current customer\'s bookings' })
  findMine(@CurrentUser('id') customerId: string, @Query() dto: QueryBookingsDto) {
    return this.bookingsService.findMine(customerId, dto);
  }

  @Get('provider')
  @Roles('SERVICE_PROVIDER')
  @ApiOperation({ summary: 'List bookings for the current provider\'s services' })
  providerList(
    @CurrentUser('id') providerUserId: string,
    @Query() dto: QueryBookingsDto,
  ) {
    return this.bookingsService.providerList(providerUserId, dto);
  }

  @Get('admin')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'List all bookings (admin view)' })
  adminList(@Query() dto: QueryBookingsDto) {
    return this.bookingsService.adminList(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single booking by id' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') actorId: string,
    @CurrentUser('role') actorRole: any,
  ) {
    return this.bookingsService.findOne(id, actorId, actorRole);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @Roles('CUSTOMER', 'ADMIN', 'MANAGER')
  @Audit({ action: 'CANCEL', entity: 'Booking' })
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(
    @Param('id') id: string,
    @CurrentUser('id') actorId: string,
    @CurrentUser('role') actorRole: any,
    @Body('reason') reason?: string,
  ) {
    return this.bookingsService.cancel(id, actorId, actorRole, reason);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'MANAGER')
  @Audit({ action: 'UPDATE_STATUS', entity: 'Booking' })
  @ApiOperation({ summary: 'Admin: update booking status' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto);
  }
}

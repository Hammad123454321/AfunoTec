import {
  Controller,
  Get,
  Post,
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
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Idempotent } from '../../common/idempotency/idempotent.decorator';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.CREATED)
  @Roles('CUSTOMER')
  @Idempotent()
  @ApiOperation({ summary: 'Initiate payment for a booking (gateway integration: Milestone 4)' })
  @ApiHeader({ name: 'Idempotency-Key', required: false, description: 'UUID v4 for idempotent submission' })
  initiate(
    @CurrentUser('id') userId: string,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiate(userId, dto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({ summary: 'Payment gateway webhook (Milestone 4 stub)' })
  webhook(@Body() payload: unknown) {
    return this.paymentsService.handleWebhook(payload);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'List all payments (ADMIN/MANAGER)' })
  adminList(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.paymentsService.adminList(page, limit, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment by id (owner or ADMIN)' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.paymentsService.findOne(id, userId, role);
  }

  @Post(':id/refund')
  @HttpCode(HttpStatus.OK)
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Refund a payment (Milestone 4 stub)' })
  refund(@Param('id') id: string, @CurrentUser('id') actorId: string) {
    return this.paymentsService.refund(id, actorId);
  }
}

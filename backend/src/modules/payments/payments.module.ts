import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from '../../database/schemas/payment.schema';
import { Booking, BookingSchema } from '../../database/schemas/booking.schema';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

/**
 * Payment lifecycle: idempotent initiation, owner/admin lookup, admin listing.
 * Gateway/webhook/refund integration is Milestone 4. Payment + Booking status
 * are updated together inside a transaction (TransactionService) when applicable.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

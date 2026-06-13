import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../../database/schemas/booking.schema';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import {
  ServiceRoom,
  ServiceRoomSchema,
} from '../../database/schemas/service-room.schema';
import {
  ServiceAvailability,
  ServiceAvailabilitySchema,
} from '../../database/schemas/service-availability.schema';
import {
  ServiceProviderProfile,
  ServiceProviderProfileSchema,
} from '../../database/schemas/service-provider-profile.schema';
import { Payment, PaymentSchema } from '../../database/schemas/payment.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { Currency, CurrencySchema } from '../../database/schemas/currency.schema';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsPricingService } from './bookings-pricing.service';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    ServicesModule,
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceRoom.name, schema: ServiceRoomSchema },
      { name: ServiceAvailability.name, schema: ServiceAvailabilitySchema },
      { name: ServiceProviderProfile.name, schema: ServiceProviderProfileSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: User.name, schema: UserSchema },
      { name: Currency.name, schema: CurrencySchema },
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsPricingService],
  exports: [BookingsService, BookingsPricingService],
})
export class BookingsModule {}

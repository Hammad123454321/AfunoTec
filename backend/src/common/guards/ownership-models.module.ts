import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import {
  ServiceProviderProfile,
  ServiceProviderProfileSchema,
} from '../../database/schemas/service-provider-profile.schema';
import { Review, ReviewSchema } from '../../database/schemas/review.schema';
import { Booking, BookingSchema } from '../../database/schemas/booking.schema';
import { Cart, CartSchema } from '../../database/schemas/cart.schema';

/**
 * Registers the models the global `OwnershipGuard` (an `APP_GUARD`) injects.
 * Because the guard resolves in the root injector, its models must be available
 * globally rather than only inside feature modules. Global so the registration
 * is visible at the root scope where the guard is constructed.
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceProviderProfile.name, schema: ServiceProviderProfileSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class OwnershipModelsModule {}

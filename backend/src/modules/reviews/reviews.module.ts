import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../../database/schemas/booking.schema';
import { Review, ReviewSchema } from '../../database/schemas/review.schema';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import { ReviewsController, ServiceReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

/**
 * Service reviews: public read, customer create (gated on a completed booking),
 * edit within a window, and delete (owner/admin). Service rating/reviewCount
 * aggregates are recomputed transactionally on every change.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [ServiceReviewsController, ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}

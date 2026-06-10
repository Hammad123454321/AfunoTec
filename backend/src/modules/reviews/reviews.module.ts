import { Module } from '@nestjs/common';
import { ReviewsController, ServiceReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

/**
 * Service reviews: public read, customer create (gated on a completed booking),
 * edit within a window, and delete (owner/admin). Service rating/reviewCount
 * aggregates are recomputed transactionally on every change.
 */
@Module({
  controllers: [ServiceReviewsController, ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}

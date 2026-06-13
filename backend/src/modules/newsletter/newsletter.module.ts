import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NewsletterSubscriber,
  NewsletterSubscriberSchema,
} from '../../database/schemas/newsletter-subscriber.schema';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';

/** Newsletter: public subscribe (idempotent) + admin listing/removal. */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsletterSubscriber.name, schema: NewsletterSubscriberSchema },
    ]),
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService],
  exports: [NewsletterService],
})
export class NewsletterModule {}

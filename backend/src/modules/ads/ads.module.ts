import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdBanner, AdBannerSchema } from '../../database/schemas/ad-banner.schema';
import {
  HomepageShowcase,
  HomepageShowcaseSchema,
} from '../../database/schemas/homepage-showcase.schema';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdBanner.name, schema: AdBannerSchema },
      { name: HomepageShowcase.name, schema: HomepageShowcaseSchema },
    ]),
  ],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}

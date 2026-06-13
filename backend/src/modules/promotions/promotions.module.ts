import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoCode, PromoCodeSchema } from '../../database/schemas/promo-code.schema';
import { GiftCard, GiftCardSchema } from '../../database/schemas/gift-card.schema';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';

/**
 * Promo-code and gift-card management: admin CRUD plus customer-facing
 * validation/preview of promo-code discounts and gift-card balances.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PromoCode.name, schema: PromoCodeSchema },
      { name: GiftCard.name, schema: GiftCardSchema },
    ]),
  ],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService],
})
export class PromotionsModule {}

import { Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

/**
 * Customer shopping cart. Imports ServicesModule for ServicePricingService so
 * line items are priced (effective price) at add time.
 */
@Module({
  imports: [ServicesModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

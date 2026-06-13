import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from '../../database/schemas/cart.schema';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import { ServicesModule } from '../services/services.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

/**
 * Customer shopping cart. Imports ServicesModule for ServicePricingService so
 * line items are priced (effective price) at add time. Registers the Cart model
 * (embedded items) and the Service model (price/add-on/name resolution).
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
    ServicesModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

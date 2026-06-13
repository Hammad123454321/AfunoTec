import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WishlistItem, WishlistItemSchema } from '../../database/schemas/wishlist-item.schema';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

/** Customer wishlist: add/remove/list favourite services (idempotent). */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WishlistItem.name, schema: WishlistItemSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}

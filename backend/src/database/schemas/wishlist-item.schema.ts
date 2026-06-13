import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { Service } from './service.schema';
import { User } from './user.schema';

@Schema(baseSchemaOptions('wishlist_items'))
export class WishlistItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId!: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Service.name, required: true })
  serviceId!: Types.ObjectId;
}

export type WishlistItemDocument = HydratedDocument<WishlistItem>;
export const WishlistItemSchema = SchemaFactory.createForClass(WishlistItem);

WishlistItemSchema.index({ userId: 1, serviceId: 1 }, { unique: true });

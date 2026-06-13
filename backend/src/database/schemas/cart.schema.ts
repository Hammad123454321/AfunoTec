import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { Service } from './service.schema';
import { User } from './user.schema';

@Schema({ _id: true })
export class CartItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: Service.name, required: true })
  serviceId!: Types.ObjectId;

  @Prop({ type: Date, required: false }) startDate?: Date | null;
  @Prop({ type: Date, required: false }) endDate?: Date | null;
  @Prop({ default: 1 }) units!: number;
  @Prop({ default: 1 }) adults!: number;
  @Prop({ type: [Number], default: undefined }) childrenAges?: number[] | null;
  @Prop({ type: SchemaTypes.Mixed, required: false }) addOns?: unknown;
  @Prop({ type: SchemaTypes.Decimal128, required: true }) unitPrice!: Types.Decimal128;
  @Prop({ default: 'MGA' }) currency!: string;
  @Prop({ type: Date, default: () => new Date() }) createdAt!: Date;
  @Prop({ type: Date, default: () => new Date() }) updatedAt!: Date;
}
export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema(baseSchemaOptions('carts'))
export class Cart {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true, unique: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ default: 'MGA' }) currency!: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items!: CartItem[];
}

export type CartDocument = HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);

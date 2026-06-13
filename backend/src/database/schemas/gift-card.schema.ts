import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { User } from './user.schema';

@Schema({ ...baseSchemaOptions('gift_cards'), optimisticConcurrency: true })
export class GiftCard {
  @Prop({ required: true, unique: true, index: true })
  code!: string;

  @Prop({ type: SchemaTypes.Decimal128, required: true }) initialAmount!: Types.Decimal128;
  @Prop({ type: SchemaTypes.Decimal128, required: true }) balance!: Types.Decimal128;
  @Prop({ default: 'MGA' }) currency!: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: false })
  issuedById?: Types.ObjectId | null;
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: false })
  ownedById?: Types.ObjectId | null;

  @Prop({ type: String, required: false }) recipientEmail?: string | null;
  @Prop({ type: String, required: false }) message?: string | null;
  @Prop({ type: Date, required: false }) expiresAt?: Date | null;
  @Prop({ default: true }) isActive!: boolean;
}

export type GiftCardDocument = HydratedDocument<GiftCard>;
export const GiftCardSchema = SchemaFactory.createForClass(GiftCard);

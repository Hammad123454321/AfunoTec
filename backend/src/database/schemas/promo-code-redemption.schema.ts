import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { PromoCode } from './promo-code.schema';
import { User } from './user.schema';

@Schema(baseSchemaOptions('promo_code_redemptions'))
export class PromoCodeRedemption {
  @Prop({ type: SchemaTypes.ObjectId, ref: PromoCode.name, required: true })
  promoCodeId!: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: false })
  bookingId?: Types.ObjectId | null;

  @Prop({ type: Date, default: () => new Date() })
  redeemedAt!: Date;
}

export type PromoCodeRedemptionDocument = HydratedDocument<PromoCodeRedemption>;
export const PromoCodeRedemptionSchema = SchemaFactory.createForClass(PromoCodeRedemption);

// Replaces Prisma @@unique([promoCodeId, bookingId]).
PromoCodeRedemptionSchema.index({ promoCodeId: 1, bookingId: 1 }, { unique: true });

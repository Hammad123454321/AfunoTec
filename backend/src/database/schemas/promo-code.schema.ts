import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { PromoCodeType } from '../../common/enums';
import { baseSchemaOptions } from './schema.helpers';

@Schema(baseSchemaOptions('promo_codes'))
export class PromoCode {
  @Prop({ required: true, unique: true, index: true })
  code!: string;

  @Prop({ type: String, required: false }) description?: string | null;

  @Prop({ type: String, enum: Object.values(PromoCodeType), default: PromoCodeType.PERCENT })
  type!: PromoCodeType;

  @Prop({ type: SchemaTypes.Decimal128, required: true }) value!: Types.Decimal128;

  /** { categoryIds?: [], serviceIds?: [] } */
  @Prop({ type: SchemaTypes.Mixed, required: false }) appliesTo?: Record<string, unknown> | null;

  @Prop({ type: SchemaTypes.Decimal128, required: false }) minSpend?: Types.Decimal128 | null;
  @Prop({ type: String, required: false }) currency?: string | null;
  @Prop({ type: Date, required: true }) startAt!: Date;
  @Prop({ type: Date, required: true }) endAt!: Date;
  @Prop({ type: Number, required: false }) usageLimit?: number | null;
  @Prop({ type: Number, required: false }) perUserLimit?: number | null;
  @Prop({ default: 0 }) usedCount!: number;
  @Prop({ default: true }) isActive!: boolean;
}

export type PromoCodeDocument = HydratedDocument<PromoCode>;
export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);

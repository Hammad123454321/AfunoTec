import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

/**
 * Currencies use the ISO 4217 code as their natural primary key (`_id`),
 * mirroring the Prisma model where `code` was `@id`. Base = MGA (1 MGA = 1).
 */
@Schema({ collection: 'currencies', timestamps: { createdAt: false, updatedAt: true }, versionKey: false })
export class Currency {
  /** ISO 4217 code, e.g. MGA, USD, EUR — used as `_id`. */
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) symbol!: string;
  @Prop({ type: SchemaTypes.Decimal128, required: true }) rateToMga!: Types.Decimal128;
  @Prop({ default: true }) isActive!: boolean;
}

export type CurrencyDocument = HydratedDocument<Currency>;
export const CurrencySchema = SchemaFactory.createForClass(Currency);

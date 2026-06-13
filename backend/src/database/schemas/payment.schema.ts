import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../../common/enums';
import { baseSchemaOptions } from './schema.helpers';
import { Booking } from './booking.schema';
import { User } from './user.schema';

@Schema({ ...baseSchemaOptions('payments'), optimisticConcurrency: true })
export class Payment {
  @Prop({ type: SchemaTypes.ObjectId, ref: Booking.name, required: false, index: true })
  bookingId?: Types.ObjectId | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(PaymentMethod), required: true })
  method!: PaymentMethod;

  @Prop({ type: SchemaTypes.Decimal128, required: true }) amount!: Types.Decimal128;
  @Prop({ default: 'MGA' }) currency!: string;

  @Prop({ type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.INITIATED, index: true })
  status!: PaymentStatus;

  /** Gateway transaction id. */
  @Prop({ type: String, required: false })
  providerRef?: string | null;

  @Prop({ type: String, required: false })
  idempotencyKey?: string | null;

  @Prop({ type: SchemaTypes.Mixed, required: false }) rawProviderPayload?: unknown;
  @Prop({ type: String, required: false }) failureReason?: string | null;
  @Prop({ type: Date, required: false }) capturedAt?: Date | null;
  @Prop({ type: SchemaTypes.Decimal128, required: false }) refundedAmount?: Types.Decimal128 | null;
  @Prop({ type: Date, required: false }) refundedAt?: Date | null;
}

export type PaymentDocument = HydratedDocument<Payment>;
export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Unique only when present (partial indexes avoid null collisions).
PaymentSchema.index(
  { providerRef: 1 },
  { unique: true, partialFilterExpression: { providerRef: { $type: 'string' } } },
);
PaymentSchema.index(
  { idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } },
);

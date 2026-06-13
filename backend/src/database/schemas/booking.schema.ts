import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { BookingStatus } from '../../common/enums';
import { baseSchemaOptions } from './schema.helpers';
import { GiftCard } from './gift-card.schema';
import { PromoCode } from './promo-code.schema';
import { Service } from './service.schema';
import { ServiceRoom } from './service-room.schema';
import { User } from './user.schema';

@Schema({ _id: true })
export class BookingRoom {
  @Prop({ type: SchemaTypes.ObjectId, ref: ServiceRoom.name, required: true })
  roomId!: Types.ObjectId;
  @Prop({ default: 1 }) qty!: number;
  @Prop({ type: SchemaTypes.Decimal128, required: true }) unitPrice!: Types.Decimal128;
  @Prop({ default: 'MGA' }) currency!: string;
}
export const BookingRoomSchema = SchemaFactory.createForClass(BookingRoom);

@Schema({ ...baseSchemaOptions('bookings'), optimisticConcurrency: true })
export class Booking {
  @Prop({ required: true, unique: true, index: true })
  referenceCode!: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true, index: true })
  customerId!: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Service.name, required: true, index: true })
  serviceId!: Types.ObjectId;

  /** Denormalized for payout (points to ServiceProviderProfile._id). */
  @Prop({ type: SchemaTypes.ObjectId, required: true, index: true })
  providerId!: Types.ObjectId;

  @Prop({ type: Date, required: false }) checkInDate?: Date | null;
  @Prop({ type: Date, required: false }) checkOutDate?: Date | null;
  @Prop({ default: 1 }) units!: number;
  @Prop({ default: 1 }) adults!: number;
  @Prop({ type: [Number], default: undefined }) childrenAges?: number[] | null;

  /** [{firstName,lastName,phone,email,country,roomIndex}] */
  @Prop({ type: SchemaTypes.Mixed, required: true }) guests!: unknown;
  /** [{label,amount,type:'service'|'addon'|'fee'|'tax'|'discount'}] */
  @Prop({ type: SchemaTypes.Mixed, required: true }) lineItems!: unknown;

  @Prop({ type: SchemaTypes.Decimal128, required: true }) subtotal!: Types.Decimal128;
  @Prop({ type: SchemaTypes.Decimal128, default: () => Types.Decimal128.fromString('0') })
  discountAmount!: Types.Decimal128;
  @Prop({ type: SchemaTypes.Decimal128, default: () => Types.Decimal128.fromString('0') })
  taxAmount!: Types.Decimal128;
  @Prop({ type: SchemaTypes.Decimal128, default: () => Types.Decimal128.fromString('0') })
  feeAmount!: Types.Decimal128;
  @Prop({ type: SchemaTypes.Decimal128, required: true }) total!: Types.Decimal128;
  @Prop({ default: 'MGA' }) currency!: string;
  @Prop({ type: SchemaTypes.Decimal128, required: false })
  exchangeRateToMga?: Types.Decimal128 | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: PromoCode.name, required: false })
  promoCodeId?: Types.ObjectId | null;
  @Prop({ type: SchemaTypes.ObjectId, ref: GiftCard.name, required: false })
  giftCardId?: Types.ObjectId | null;

  @Prop({ type: String, required: false })
  idempotencyKey?: string | null;

  @Prop({ type: String, required: false }) notes?: string | null;

  @Prop({ type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING, index: true })
  status!: BookingStatus;

  @Prop({ type: Date, required: false }) confirmedAt?: Date | null;
  @Prop({ type: Date, required: false }) cancelledAt?: Date | null;
  @Prop({ type: String, required: false }) cancellationReason?: string | null;
  /** PENDING -> EXPIRED reaper. */
  @Prop({ type: Date, required: false }) expiresAt?: Date | null;

  @Prop({ type: Date, required: false }) deletedAt?: Date | null;

  @Prop({ type: [BookingRoomSchema], default: [] }) rooms!: BookingRoom[];
}

export type BookingDocument = HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);

// Unique idempotency key only when present (partial index avoids null collisions).
BookingSchema.index(
  { idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } },
);

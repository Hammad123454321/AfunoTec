import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { Booking } from './booking.schema';
import { Service } from './service.schema';
import { User } from './user.schema';

@Schema(baseSchemaOptions('reviews'))
export class Review {
  @Prop({ type: SchemaTypes.ObjectId, ref: Service.name, required: true, index: true })
  serviceId!: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true, index: true })
  authorId!: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Booking.name, required: false })
  bookingId?: Types.ObjectId | null;

  @Prop({ required: true, min: 1, max: 5 }) rating!: number;
  @Prop({ type: String, required: false }) title?: string | null;
  @Prop({ type: String, required: false }) body?: string | null;
  @Prop({ default: true }) isPublished!: boolean;
}

export type ReviewDocument = HydratedDocument<Review>;
export const ReviewSchema = SchemaFactory.createForClass(Review);

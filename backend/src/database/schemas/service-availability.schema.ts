import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { Service } from './service.schema';

@Schema({ ...baseSchemaOptions('service_availabilities'), optimisticConcurrency: true })
export class ServiceAvailability {
  @Prop({ type: SchemaTypes.ObjectId, ref: Service.name, required: true })
  serviceId!: Types.ObjectId;

  /** Date-only (stored at 00:00 UTC). */
  @Prop({ type: Date, required: true, index: true })
  date!: Date;

  @Prop({ default: 1 }) qtyTotal!: number;
  @Prop({ default: 0 }) qtyReserved!: number;
  @Prop({ type: SchemaTypes.Decimal128, required: false }) priceOverride?: Types.Decimal128 | null;
  @Prop({ default: false }) isClosed!: boolean;
}

export type ServiceAvailabilityDocument = HydratedDocument<ServiceAvailability>;
export const ServiceAvailabilitySchema = SchemaFactory.createForClass(ServiceAvailability);

ServiceAvailabilitySchema.index({ serviceId: 1, date: 1 }, { unique: true });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { Service } from './service.schema';

@Schema(baseSchemaOptions('service_rooms'))
export class ServiceRoom {
  @Prop({ type: SchemaTypes.ObjectId, ref: Service.name, required: true, index: true })
  serviceId!: Types.ObjectId;

  @Prop({ required: true }) name!: string;
  @Prop({ default: 2 }) capacity!: number;
  @Prop({ type: SchemaTypes.Decimal128, required: true }) basePrice!: Types.Decimal128;
  @Prop({ default: 'MGA' }) currency!: string;
  @Prop({ default: 1 }) qtyTotal!: number;
  @Prop({ default: true }) isActive!: boolean;
}

export type ServiceRoomDocument = HydratedDocument<ServiceRoom>;
export const ServiceRoomSchema = SchemaFactory.createForClass(ServiceRoom);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { User } from './user.schema';

@Schema(baseSchemaOptions('customer_profiles'))
export class CustomerProfile {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true, unique: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: Date, required: false })
  dateOfBirth?: Date | null;

  @Prop({ type: String, required: false })
  nationality?: string | null;

  @Prop({ type: SchemaTypes.Mixed, required: false })
  address?: Record<string, unknown> | null;

  @Prop({ type: String, required: false })
  loyaltyTier?: string | null;
}

export type CustomerProfileDocument = HydratedDocument<CustomerProfile>;
export const CustomerProfileSchema = SchemaFactory.createForClass(CustomerProfile);

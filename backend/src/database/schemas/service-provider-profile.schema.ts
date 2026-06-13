import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { User } from './user.schema';

@Schema(baseSchemaOptions('service_provider_profiles'))
export class ServiceProviderProfile {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true, unique: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  businessName!: string;

  @Prop({ type: String, required: false })
  legalName?: string | null;

  @Prop({ type: String, required: false })
  taxId?: string | null;

  @Prop({ type: String, required: false })
  description?: string | null;

  @Prop({ type: String, required: false })
  websiteUrl?: string | null;

  @Prop({ type: String, required: false })
  logoUrl?: string | null;

  /** Bank details / mobile-money number — encrypted at the app layer. */
  @Prop({ type: SchemaTypes.Mixed, required: false })
  payoutMethod?: Record<string, unknown> | null;

  /** Optional override of the global commission % (Decimal128, 2dp). */
  @Prop({ type: SchemaTypes.Decimal128, required: false })
  commissionRate?: Types.Decimal128 | null;

  @Prop({ default: false })
  isVerified!: boolean;

  @Prop({ type: Date, required: false })
  verifiedAt?: Date | null;
}

export type ServiceProviderProfileDocument = HydratedDocument<ServiceProviderProfile>;
export const ServiceProviderProfileSchema = SchemaFactory.createForClass(ServiceProviderProfile);

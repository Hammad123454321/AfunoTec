import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { CommissionType, DiscountBadge, DiscountType, ServiceStatus } from '../../common/enums';
import { baseSchemaOptions } from './schema.helpers';
import { Category } from './category.schema';
import { ServiceProviderProfile } from './service-provider-profile.schema';
import { Tag } from './tag.schema';

@Schema({ _id: true })
export class ServiceImage {
  @Prop({ required: true }) url!: string;
  @Prop({ type: String, required: false }) alt?: string | null;
  @Prop({ default: 0 }) sortOrder!: number;
  @Prop({ default: false }) isPrimary!: boolean;
  @Prop({ type: Number, required: false }) width?: number | null;
  @Prop({ type: Number, required: false }) height?: number | null;
}
export const ServiceImageSchema = SchemaFactory.createForClass(ServiceImage);

@Schema({ _id: true })
export class ServiceDetailPoint {
  @Prop({ required: true }) title!: string;
  @Prop({ type: String, required: false }) description?: string | null;
  @Prop({ default: 0 }) sortOrder!: number;
}
export const ServiceDetailPointSchema = SchemaFactory.createForClass(ServiceDetailPoint);

/** Collapses the former 3-way package-item discriminator into one embedded array. */
export type PackageItemKind = 'summary' | 'conditions' | 'whyStayHere';

@Schema({ _id: true })
export class ServicePackageItem {
  @Prop({ required: true }) title!: string;
  @Prop({ type: String, required: false }) description?: string | null;
  @Prop({ default: 0 }) sortOrder!: number;
  @Prop({ type: String, enum: ['summary', 'conditions', 'whyStayHere'], required: true })
  kind!: PackageItemKind;
}
export const ServicePackageItemSchema = SchemaFactory.createForClass(ServicePackageItem);

@Schema({ _id: true })
export class ServiceAddOn {
  @Prop({ required: true }) title!: string;
  @Prop({ type: SchemaTypes.Decimal128, required: true }) price!: Types.Decimal128;
  @Prop({ default: 'MGA' }) currency!: string;
  @Prop({ default: true }) isActive!: boolean;
}
export const ServiceAddOnSchema = SchemaFactory.createForClass(ServiceAddOn);

@Schema({ _id: true })
export class ServiceDiscount {
  @Prop({ type: String, enum: Object.values(DiscountType), required: true })
  type!: DiscountType;
  @Prop({ type: SchemaTypes.Decimal128, required: true }) value!: Types.Decimal128;
  @Prop({ type: String, enum: Object.values(DiscountBadge), required: false })
  badge?: DiscountBadge | null;
  @Prop({ type: Date, required: true }) startAt!: Date;
  @Prop({ type: Date, required: true }) endAt!: Date;
  @Prop({ default: true }) isActive!: boolean;
}
export const ServiceDiscountSchema = SchemaFactory.createForClass(ServiceDiscount);

@Schema(baseSchemaOptions('services'))
export class Service {
  @Prop({ required: true, unique: true, index: true })
  slug!: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: ServiceProviderProfile.name, required: true, index: true })
  providerId!: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name, required: true })
  categoryId!: Types.ObjectId;

  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) title!: string;
  @Prop({ type: String, required: false }) shortSummary?: string | null;
  @Prop({ type: String, required: false }) description?: string | null;
  @Prop({ type: String, required: false }) duration?: string | null;
  @Prop({ type: String, required: false }) location?: string | null;
  @Prop({ type: String, required: false }) city?: string | null;
  @Prop({ type: String, required: false }) address?: string | null;
  @Prop({ type: SchemaTypes.Decimal128, required: false }) latitude?: Types.Decimal128 | null;
  @Prop({ type: SchemaTypes.Decimal128, required: false }) longitude?: Types.Decimal128 | null;

  @Prop({ type: SchemaTypes.Decimal128, required: true }) basePrice!: Types.Decimal128;
  @Prop({ default: 'MGA' }) currency!: string;
  @Prop({ default: 'per_night' }) priceUnit!: string;

  @Prop({ type: String, enum: Object.values(CommissionType), default: CommissionType.PERCENTAGE })
  commissionType!: CommissionType;
  @Prop({ type: SchemaTypes.Decimal128, default: () => Types.Decimal128.fromString('0') })
  commissionValue!: Types.Decimal128;

  @Prop({ type: String, enum: Object.values(ServiceStatus), default: ServiceStatus.DRAFT })
  status!: ServiceStatus;

  @Prop({ type: SchemaTypes.Decimal128, required: false }) rating?: Types.Decimal128 | null;
  @Prop({ default: 0 }) reviewCount!: number;
  @Prop({ default: 0 }) viewCount!: number;

  @Prop({ type: SchemaTypes.Mixed, required: false })
  contactInfo?: Record<string, unknown> | null;
  @Prop({ type: SchemaTypes.Mixed, required: false })
  translations?: Record<string, unknown> | null;

  @Prop({ type: Date, required: false, index: true })
  deletedAt?: Date | null;

  // Embedded owned children
  @Prop({ type: [ServiceImageSchema], default: [] }) images!: ServiceImage[];
  @Prop({ type: [ServiceDetailPointSchema], default: [] }) detailPoints!: ServiceDetailPoint[];
  @Prop({ type: [ServicePackageItemSchema], default: [] }) packageItems!: ServicePackageItem[];
  @Prop({ type: [ServiceAddOnSchema], default: [] }) addOns!: ServiceAddOn[];
  @Prop({ type: [ServiceDiscountSchema], default: [] }) discounts!: ServiceDiscount[];

  // Referenced tags
  @Prop({ type: [SchemaTypes.ObjectId], ref: Tag.name, default: [] })
  tags!: Types.ObjectId[];
}

export type ServiceDocument = HydratedDocument<Service>;
export const ServiceSchema = SchemaFactory.createForClass(Service);

ServiceSchema.index({ categoryId: 1, status: 1, deletedAt: 1 });
ServiceSchema.index({ location: 1, city: 1 });

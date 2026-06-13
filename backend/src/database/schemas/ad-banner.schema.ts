import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { AdPlacement } from '../../common/enums';
import { baseSchemaOptions } from './schema.helpers';

@Schema(baseSchemaOptions('ad_banners'))
export class AdBanner {
  @Prop({ type: String, enum: Object.values(AdPlacement), required: true })
  placement!: AdPlacement;

  @Prop({ required: true }) imageUrl!: string;
  @Prop({ type: String, required: false }) linkUrl?: string | null;
  @Prop({ type: String, required: false }) title?: string | null;
  @Prop({ type: String, required: false }) description?: string | null;
  @Prop({ type: SchemaTypes.Mixed, required: false }) translations?: Record<string, unknown> | null;
  @Prop({ type: Date, required: true }) startAt!: Date;
  @Prop({ type: Date, required: true }) endAt!: Date;
  @Prop({ default: 0 }) sortOrder!: number;
  @Prop({ default: true }) isActive!: boolean;
}

export type AdBannerDocument = HydratedDocument<AdBanner>;
export const AdBannerSchema = SchemaFactory.createForClass(AdBanner);

AdBannerSchema.index({ placement: 1, isActive: 1, startAt: 1, endAt: 1 });

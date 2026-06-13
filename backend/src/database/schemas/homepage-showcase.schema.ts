import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { CategoryType } from '../../common/enums';
import { baseSchemaOptions } from './schema.helpers';

@Schema(baseSchemaOptions('homepage_showcases'))
export class HomepageShowcase {
  /** e.g. "flash_offers", "trending", "best_deals" */
  @Prop({ required: true, unique: true, index: true })
  slot!: string;

  @Prop({ type: String, enum: Object.values(CategoryType), required: false })
  categoryType?: CategoryType | null;

  /** [{ serviceId, sortOrder }] */
  @Prop({ type: SchemaTypes.Mixed, required: true }) items!: unknown;

  @Prop({ default: true }) isActive!: boolean;
}

export type HomepageShowcaseDocument = HydratedDocument<HomepageShowcase>;
export const HomepageShowcaseSchema = SchemaFactory.createForClass(HomepageShowcase);

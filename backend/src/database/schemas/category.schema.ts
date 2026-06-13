import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { CategoryType } from '../../common/enums';
import { baseSchemaOptions } from './schema.helpers';

@Schema(baseSchemaOptions('categories'))
export class Category {
  @Prop({ required: true, unique: true, index: true })
  slug!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: String, enum: Object.values(CategoryType), required: true })
  type!: CategoryType;

  @Prop({ type: String, required: false })
  iconName?: string | null;

  @Prop({ type: String, required: false })
  imageUrl?: string | null;

  @Prop({ default: 0 })
  sortOrder!: number;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: SchemaTypes.Mixed, required: false })
  translations?: Record<string, unknown> | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name, required: false, default: null })
  parentId?: Types.ObjectId | null;
}

export type CategoryDocument = HydratedDocument<Category>;
export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ type: 1, isActive: 1 });

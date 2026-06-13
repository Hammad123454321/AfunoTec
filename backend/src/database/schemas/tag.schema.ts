import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';

@Schema(baseSchemaOptions('tags'))
export class Tag {
  @Prop({ required: true, unique: true, index: true })
  slug!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: SchemaTypes.Mixed, required: false })
  translations?: Record<string, unknown> | null;
}

export type TagDocument = HydratedDocument<Tag>;
export const TagSchema = SchemaFactory.createForClass(Tag);

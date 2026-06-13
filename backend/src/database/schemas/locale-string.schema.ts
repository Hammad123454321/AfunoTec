import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

@Schema({ collection: 'locale_strings', timestamps: { createdAt: false, updatedAt: true }, versionKey: false })
export class LocaleString {
  @Prop({ required: true, unique: true, index: true })
  key!: string;

  /** { en: "...", fr: "...", mg: "..." } */
  @Prop({ type: SchemaTypes.Mixed, required: true })
  translations!: Record<string, string>;

  @Prop({ type: String, required: false }) category?: string | null;
}

export type LocaleStringDocument = HydratedDocument<LocaleString>;
export const LocaleStringSchema = SchemaFactory.createForClass(LocaleString);

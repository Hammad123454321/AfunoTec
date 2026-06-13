import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';

@Schema(baseSchemaOptions('newsletter_subscribers'))
export class NewsletterSubscriber {
  @Prop({ required: true, unique: true, index: true })
  email!: string;

  @Prop({ type: String, required: false }) locale?: string | null;
  @Prop({ default: true }) isActive!: boolean;
}

export type NewsletterSubscriberDocument = HydratedDocument<NewsletterSubscriber>;
export const NewsletterSubscriberSchema = SchemaFactory.createForClass(NewsletterSubscriber);

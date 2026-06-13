import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';

@Schema({ ...baseSchemaOptions('idempotency_keys'), timestamps: { createdAt: true, updatedAt: false } })
export class IdempotencyKey {
  @Prop({ required: true }) key!: string;
  @Prop({ type: String, required: false }) userId?: string | null;
  @Prop({ required: true }) method!: string;
  @Prop({ required: true }) path!: string;
  /** sha256 of the normalized request body. */
  @Prop({ required: true }) requestHash!: string;
  @Prop({ type: Number, required: false }) statusCode?: number | null;
  @Prop({ type: SchemaTypes.Mixed, required: false }) responseBody?: unknown;
  @Prop({ type: Date, required: false }) lockedAt?: Date | null;
  @Prop({ type: Date, required: false }) completedAt?: Date | null;
}

export type IdempotencyKeyDocument = HydratedDocument<IdempotencyKey>;
export const IdempotencyKeySchema = SchemaFactory.createForClass(IdempotencyKey);

// Replaces Prisma @@unique([key, userId, path]).
IdempotencyKeySchema.index({ key: 1, userId: 1, path: 1 }, { unique: true });
// Auto-purge stored responses after 24h.
IdempotencyKeySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

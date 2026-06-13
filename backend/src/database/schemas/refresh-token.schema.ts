import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { User } from './user.schema';

@Schema(baseSchemaOptions('refresh_tokens'))
export class RefreshToken {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  tokenHash!: string;

  @Prop({ type: String, required: false })
  userAgent?: string | null;

  @Prop({ type: String, required: false })
  ip?: string | null;

  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ type: Date, required: false })
  revokedAt?: Date | null;
}

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

// TTL: purge tokens 30 days past expiry (keeps a short forensic window for reuse detection).
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

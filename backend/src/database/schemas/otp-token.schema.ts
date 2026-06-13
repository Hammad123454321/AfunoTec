import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { OtpPurpose } from '../../common/enums';
import { baseSchemaOptions } from './schema.helpers';
import { User } from './user.schema';

@Schema(baseSchemaOptions('otp_tokens'))
export class OtpToken {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: false })
  userId?: Types.ObjectId | null;

  /** Email or phone — used when the user does not yet exist (e.g. registration). */
  @Prop({ required: true })
  identifier!: string;

  @Prop({ type: String, enum: Object.values(OtpPurpose), required: true })
  purpose!: OtpPurpose;

  @Prop({ required: true })
  codeHash!: string;

  @Prop({ default: 0 })
  attempts!: number;

  @Prop({ type: Date, required: true })
  expiresAt!: Date;

  @Prop({ type: Date, required: false })
  consumedAt?: Date | null;
}

export type OtpTokenDocument = HydratedDocument<OtpToken>;
export const OtpTokenSchema = SchemaFactory.createForClass(OtpToken);

OtpTokenSchema.index({ identifier: 1, purpose: 1 });
// TTL: purge 1 day after expiry.
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

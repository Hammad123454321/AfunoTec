import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../../common/enums';
import { baseSchemaOptions } from './schema.helpers';

@Schema(baseSchemaOptions('users'))
export class User {
  @Prop({ required: true, unique: true, index: true })
  email!: string;

  @Prop({ type: Date, required: false })
  emailVerifiedAt?: Date | null;

  @Prop({ type: String, required: false })
  phone?: string | null;

  @Prop({ type: Date, required: false })
  phoneVerifiedAt?: Date | null;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: String, required: false })
  country?: string | null;

  @Prop({ type: String, required: false })
  profileUrl?: string | null;

  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER, index: true })
  role!: UserRole;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: false })
  isTwoFactorEnabled!: boolean;

  @Prop({ default: 0 })
  failedLoginCount!: number;

  @Prop({ type: Date, required: false })
  lockedUntil?: Date | null;

  @Prop({ type: Date, required: false })
  lastLoginAt?: Date | null;

  @Prop({ type: String, required: false })
  lastLoginIp?: string | null;

  @Prop({ default: 'en' })
  preferredLocale!: string;

  @Prop({ default: 'MGA' })
  preferredCurrency!: string;

  @Prop({ type: Date, required: false, index: true })
  deletedAt?: Date | null;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

// Unique phone ONLY when present as a string — a partial index, so multiple
// users with no phone (null/absent) do not collide. (A plain sparse+unique
// index still collides on explicit `phone: null`.)
UserSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $type: 'string' } } },
);

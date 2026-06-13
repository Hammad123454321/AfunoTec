import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { User } from './user.schema';

@Schema({ ...baseSchemaOptions('audit_logs'), timestamps: { createdAt: true, updatedAt: false } })
export class AuditLog {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: false, index: true })
  actorId?: Types.ObjectId | null;

  /** CREATE | UPDATE | DELETE | LOGIN | etc. */
  @Prop({ required: true }) action!: string;
  /** e.g. "Service", "Booking" */
  @Prop({ required: true }) entity!: string;
  @Prop({ type: String, required: false }) entityId?: string | null;
  @Prop({ type: SchemaTypes.Mixed, required: false }) diff?: Record<string, unknown> | null;
  @Prop({ type: String, required: false }) ip?: string | null;
  @Prop({ type: String, required: false }) userAgent?: string | null;
}

export type AuditLogDocument = HydratedDocument<AuditLog>;
export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ entity: 1, entityId: 1 });
AuditLogSchema.index({ createdAt: 1 });

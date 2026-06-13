import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { User } from './user.schema';

@Schema({ ...baseSchemaOptions('file_objects'), timestamps: { createdAt: true, updatedAt: false } })
export class FileObject {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  uploaderId!: Types.ObjectId;

  @Prop({ required: true }) bucket!: string;
  @Prop({ required: true }) key!: string;
  @Prop({ required: true }) url!: string;
  @Prop({ type: String, required: false }) contentType?: string | null;
  @Prop({ type: Number, required: false }) size?: number | null;
}

export type FileObjectDocument = HydratedDocument<FileObject>;
export const FileObjectSchema = SchemaFactory.createForClass(FileObject);

FileObjectSchema.index({ bucket: 1, key: 1 }, { unique: true });

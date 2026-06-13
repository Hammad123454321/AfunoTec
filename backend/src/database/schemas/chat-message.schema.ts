import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { baseSchemaOptions } from './schema.helpers';
import { ChatRoom } from './chat-room.schema';
import { User } from './user.schema';

@Schema(baseSchemaOptions('chat_messages'))
export class ChatMessage {
  @Prop({ type: SchemaTypes.ObjectId, ref: ChatRoom.name, required: true, index: true })
  roomId!: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  senderId!: Types.ObjectId;

  @Prop({ required: true }) body!: string;
  @Prop({ type: SchemaTypes.Mixed, required: false }) attachments?: unknown;
  @Prop({ type: SchemaTypes.Mixed, required: false }) readBy?: unknown;
}

export type ChatMessageDocument = HydratedDocument<ChatMessage>;
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

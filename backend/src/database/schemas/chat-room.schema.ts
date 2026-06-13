import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { ChatRoomType } from '../../common/enums';
import { baseSchemaOptions } from './schema.helpers';
import { Booking } from './booking.schema';
import { User } from './user.schema';

@Schema({ _id: false })
export class ChatRoomMember {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId!: Types.ObjectId;
  @Prop({ type: Date, default: () => new Date() }) joinedAt!: Date;
  @Prop({ type: Date, required: false }) leftAt?: Date | null;
  @Prop({ default: false }) isAdmin!: boolean;
}
export const ChatRoomMemberSchema = SchemaFactory.createForClass(ChatRoomMember);

@Schema(baseSchemaOptions('chat_rooms'))
export class ChatRoom {
  @Prop({ type: String, enum: Object.values(ChatRoomType), default: ChatRoomType.SUPPORT })
  type!: ChatRoomType;

  @Prop({ type: SchemaTypes.ObjectId, ref: Booking.name, required: false, index: true })
  bookingId?: Types.ObjectId | null;

  @Prop({ type: String, required: false }) topic?: string | null;
  @Prop({ type: Date, required: false }) lastMessageAt?: Date | null;

  @Prop({ type: [ChatRoomMemberSchema], default: [] })
  members!: ChatRoomMember[];
}

export type ChatRoomDocument = HydratedDocument<ChatRoom>;
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

// Enforce one membership row per user within a room.
ChatRoomSchema.index({ _id: 1, 'members.userId': 1 }, { unique: true, sparse: true });

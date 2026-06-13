import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom, ChatRoomDocument } from '../../database/schemas/chat-room.schema';
import {
  ChatMessage,
  ChatMessageDocument,
} from '../../database/schemas/chat-message.schema';
import { ChatRoomType } from '../../common/enums';
import { TransactionService } from '../../database/transaction.service';
import { toRecord } from '../../database/schemas/schema.helpers';
import { clampPagination, buildPaginationMeta } from '../../common/utils/pagination';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name) private readonly roomModel: Model<ChatRoomDocument>,
    @InjectModel(ChatMessage.name)
    private readonly messageModel: Model<ChatMessageDocument>,
    private readonly tx: TransactionService,
  ) {}

  async listRooms(userId: string) {
    const rooms = await this.roomModel
      .find({ members: { $elemMatch: { userId, leftAt: null } } })
      .sort({ lastMessageAt: 'desc' })
      .lean()
      .exec();

    return Promise.all(
      rooms.map(async (room) => {
        const messages = await this.messageModel
          .countDocuments({ roomId: room._id })
          .exec();
        const r = room as typeof room & { createdAt: Date };
        return {
          id: r._id.toString(),
          type: r.type,
          topic: r.topic,
          bookingId: r.bookingId,
          lastMessageAt: r.lastMessageAt,
          createdAt: r.createdAt,
          _count: { messages },
        };
      }),
    );
  }

  async getMessages(roomId: string, userId: string, page?: number, limit?: number) {
    await this.assertMember(roomId, userId);
    const { skip, take, page: p, limit: l } = clampPagination(page, limit);

    const [messages, total] = await Promise.all([
      this.messageModel
        .find({ roomId })
        .sort({ createdAt: 'desc' })
        .skip(skip)
        .limit(take)
        .populate('senderId', 'name profileUrl')
        .lean()
        .exec(),
      this.messageModel.countDocuments({ roomId }).exec(),
    ]);

    const data = messages.map((m) => {
      const msg = m as typeof m & { createdAt: Date };
      const sender = m.senderId as unknown as
        | ({ _id: { toString(): string }; name?: string; profileUrl?: string })
        | null;
      return {
        id: msg._id.toString(),
        body: msg.body,
        attachments: msg.attachments,
        readBy: msg.readBy,
        createdAt: msg.createdAt,
        sender: sender
          ? {
              id: sender._id.toString(),
              name: sender.name,
              profileUrl: sender.profileUrl,
            }
          : null,
      };
    });

    return { data, meta: buildPaginationMeta(total, p, l) };
  }

  async createRoom(userId: string, dto: CreateRoomDto) {
    const members: { userId: string; isAdmin: boolean }[] = [
      { userId, isAdmin: true },
    ];
    if (dto.participantId && dto.participantId !== userId) {
      members.push({ userId: dto.participantId, isAdmin: false });
    }

    const room = await this.tx.run(async (session) => {
      const [created] = await this.roomModel.create(
        [
          {
            type: dto.type ?? ChatRoomType.SUPPORT,
            topic: dto.topic,
            bookingId: dto.bookingId,
            members,
          },
        ],
        { session },
      );
      return created;
    });

    return toRecord(room.toObject() as never);
  }

  async sendMessage(roomId: string, senderId: string, dto: SendMessageDto) {
    await this.assertMember(roomId, senderId);

    const message = await this.tx.run(async (session) => {
      const [created] = await this.messageModel.create(
        [
          {
            roomId,
            senderId,
            body: dto.body,
            attachments: dto.attachments ?? null,
          },
        ],
        { session },
      );
      await this.roomModel.updateOne(
        { _id: roomId },
        { $set: { lastMessageAt: new Date() } },
        { session },
      );
      return created;
    });

    const created = message as typeof message & { createdAt: Date };
    return {
      id: created._id.toString(),
      body: created.body,
      attachments: created.attachments,
      createdAt: created.createdAt,
      senderId: created.senderId,
    };
  }

  async markRead(roomId: string, userId: string, upToMessageId: string) {
    await this.assertMember(roomId, userId);
    const message = await this.messageModel
      .findOne({ _id: upToMessageId, roomId })
      .exec();
    if (!message) throw new NotFoundException('Message not found in this room');

    // Persist readBy as a JSON map { [userId]: messageId }
    const existing = (message.readBy as Record<string, string>) ?? {};
    existing[userId] = upToMessageId;
    await this.messageModel.updateOne(
      { _id: upToMessageId },
      { $set: { readBy: existing } },
    );

    return { read: true };
  }

  private async assertMember(roomId: string, userId: string) {
    const member = await this.roomModel
      .exists({ _id: roomId, members: { $elemMatch: { userId, leftAt: null } } })
      .then(Boolean);
    if (!member) throw new ForbiddenException('You are not a member of this room');
  }
}

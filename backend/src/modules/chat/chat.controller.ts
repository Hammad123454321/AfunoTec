import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MarkReadDto } from './dto/mark-read.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  @ApiOperation({ summary: 'List rooms the current user belongs to' })
  listRooms(@CurrentUser('id') userId: string) {
    return this.chatService.listRooms(userId);
  }

  @Post('rooms')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a chat room' })
  createRoom(@CurrentUser('id') userId: string, @Body() dto: CreateRoomDto) {
    return this.chatService.createRoom(userId, dto);
  }

  @Get('rooms/:id/messages')
  @ApiOperation({ summary: 'Paginated message history for a room' })
  getMessages(
    @Param('id') roomId: string,
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getMessages(roomId, userId, page, limit);
  }

  @Post('rooms/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a message (REST fallback; canonical path is WebSocket)' })
  sendMessage(
    @Param('id') roomId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(roomId, userId, dto);
  }

  @Post('rooms/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark messages as read up to a given message id' })
  markRead(
    @Param('id') roomId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: MarkReadDto,
  ) {
    return this.chatService.markRead(roomId, userId, dto.upToMessageId);
  }
}

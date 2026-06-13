import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

/**
 * Socket.IO gateway for real-time chat.
 * Full implementation is Milestone 3; this skeleton wires the connection
 * lifecycle and stubs out the canonical events so the contract surface exists.
 */
@WebSocketGateway({ namespace: '/ws/chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    // Token auth wired in Milestone 3 (full guard integration)
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message.send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; body: string; attachments?: unknown[] },
  ) {
    // Full implementation Milestone 3
    client.emit('error', { message: 'Real-time messaging is available in Milestone 3' });
  }

  @SubscribeMessage('message.read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; upToMessageId: string },
  ) {
    client.emit('error', { message: 'Real-time read receipts are available in Milestone 3' });
  }

  @SubscribeMessage('typing.start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    client.to(payload.roomId).emit('typing.start', { userId: client.id });
  }

  @SubscribeMessage('typing.stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    client.to(payload.roomId).emit('typing.stop', { userId: client.id });
  }
}

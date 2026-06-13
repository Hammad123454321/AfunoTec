import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ChatRoomType } from '../../../common/enums';

export class CreateRoomDto {
  @ApiPropertyOptional({ enum: ChatRoomType, default: ChatRoomType.SUPPORT })
  @IsOptional()
  @IsEnum(ChatRoomType)
  type?: ChatRoomType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ description: 'Booking to associate the room with' })
  @IsOptional()
  @IsUUID()
  bookingId?: string;

  @ApiPropertyOptional({ description: 'Other participant user id (for PROVIDER_CUSTOMER rooms)' })
  @IsOptional()
  @IsUUID()
  participantId?: string;
}

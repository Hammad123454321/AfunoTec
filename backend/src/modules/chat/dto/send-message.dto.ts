import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class SendMessageDto {
  @ApiProperty()
  @IsString()
  @MaxLength(4000)
  body: string;

  @ApiPropertyOptional({ description: 'Attachment metadata array (persisted as JSON)' })
  @IsOptional()
  attachments?: unknown[];
}

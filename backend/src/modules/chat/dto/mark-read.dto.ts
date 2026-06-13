import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MarkReadDto {
  @ApiProperty({ description: 'Last-read message id' })
  @IsString()
  upToMessageId: string;
}

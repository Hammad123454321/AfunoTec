import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({ example: 'reader@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ enum: ['en', 'fr', 'mg'], example: 'en' })
  @IsOptional()
  @IsIn(['en', 'fr', 'mg'])
  locale?: string;
}

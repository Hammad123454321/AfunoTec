import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/** Fields an admin may change on any user (excludes role/status/password — those have dedicated routes). */
export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ example: '+261340000000' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @ApiPropertyOptional({ example: 'Madagascar' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  country?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.png' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  profileUrl?: string;

  @ApiPropertyOptional({ enum: ['en', 'fr', 'mg'] })
  @IsOptional()
  @IsIn(['en', 'fr', 'mg'])
  preferredLocale?: string;

  @ApiPropertyOptional({ enum: ['MGA', 'USD', 'EUR'] })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  preferredCurrency?: string;
}

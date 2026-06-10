import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class AddCartItemDto {
  @ApiProperty()
  @IsString()
  serviceId!: string;

  @ApiPropertyOptional({ example: '2026-07-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-07-05' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ default: 1, description: 'Quantity (nights/units/seats)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  units?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  adults?: number;

  @ApiPropertyOptional({ type: [Number], description: 'Ages of children for transparent pricing' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @Type(() => Number)
  @IsInt({ each: true })
  childrenAges?: number[];

  @ApiPropertyOptional({ type: [String], description: 'Add-on ids to include' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  addOnIds?: string[];
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

/** Query a per-day availability slice over [from, to]. */
export class QueryRangeDto {
  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  from!: string;

  @ApiProperty({ example: '2026-07-10' })
  @IsDateString()
  to!: string;
}

/** Bulk-set availability across a date range (inclusive). */
export class SetAvailabilityDto {
  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  from!: string;

  @ApiProperty({ example: '2026-07-10' })
  @IsDateString()
  to!: string;

  @ApiPropertyOptional({ description: 'Total inventory per day' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  qtyTotal?: number;

  @ApiPropertyOptional({ description: 'Per-day price override' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceOverride?: number;

  @ApiPropertyOptional({ description: 'Mark the days closed/open' })
  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}

/** Override a single day. */
export class OverrideDayDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  qtyTotal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceOverride?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

/** Admin manual override of a currency's display fields and rate. */
export class UpdateCurrencyDto {
  @ApiPropertyOptional({ example: 'US Dollar' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional({ example: '$' })
  @IsOptional()
  @IsString()
  @MaxLength(8)
  symbol?: string;

  @ApiPropertyOptional({ example: 4500, description: 'Value of 1 unit of this currency in MGA' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rateToMga?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiscountBadge, DiscountType } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ServiceImageDto {
  @ApiProperty()
  @IsString()
  @MaxLength(2048)
  url!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  alt?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class ServiceDetailPointDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class ServicePackageItemDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class ServiceAddOnDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ default: 'MGA' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;
}

export class ServiceRoomDto {
  @ApiProperty({ example: 'Deluxe Sea View' })
  @IsString()
  @MaxLength(160)
  name!: string;

  @ApiPropertyOptional({ default: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @ApiPropertyOptional({ default: 'MGA' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  qtyTotal?: number;
}

export class ServiceDiscountDto {
  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  type!: DiscountType;

  @ApiProperty({ example: 15, description: 'Percent (0-100) or fixed amount depending on type' })
  @IsNumber()
  @Min(0)
  value!: number;

  @ApiPropertyOptional({ enum: DiscountBadge })
  @IsOptional()
  @IsEnum(DiscountBadge)
  badge?: DiscountBadge;

  @ApiProperty()
  @IsDateString()
  startAt!: string;

  @ApiProperty()
  @IsDateString()
  endAt!: string;
}

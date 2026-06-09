import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  ServiceAddOnDto,
  ServiceDetailPointDto,
  ServiceDiscountDto,
  ServiceImageDto,
  ServicePackageItemDto,
  ServiceRoomDto,
} from './nested.dto';

export class CreateServiceDto {
  @ApiProperty({ example: 'Baobab Beach Resort' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name!: string;

  @ApiProperty({ example: 'Beachfront resort in Nosy Be' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiProperty({ description: 'Category id the service belongs to' })
  @IsString()
  categoryId!: string;

  @ApiPropertyOptional({ description: 'Slug; auto-generated from name when omitted' })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shortSummary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '3 days' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  duration?: string;

  @ApiPropertyOptional({ description: 'Region: North | South | Center | East | West' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @ApiPropertyOptional({ default: 'MGA' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ default: 'per_night' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  priceUnit?: string;

  @ApiPropertyOptional({ description: 'Tag ids to attach' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ApiPropertyOptional({ description: 'Per-locale translations { en, fr, mg }' })
  @IsOptional()
  @IsObject()
  translations?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  contactInfo?: Record<string, unknown>;

  @ApiPropertyOptional({ type: [ServiceImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceImageDto)
  images?: ServiceImageDto[];

  @ApiPropertyOptional({ type: [ServiceDetailPointDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDetailPointDto)
  detailPoints?: ServiceDetailPointDto[];

  @ApiPropertyOptional({ type: [ServicePackageItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicePackageItemDto)
  packageSummary?: ServicePackageItemDto[];

  @ApiPropertyOptional({ type: [ServicePackageItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicePackageItemDto)
  packageConditions?: ServicePackageItemDto[];

  @ApiPropertyOptional({ type: [ServicePackageItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicePackageItemDto)
  whyStayHere?: ServicePackageItemDto[];

  @ApiPropertyOptional({ type: [ServiceAddOnDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceAddOnDto)
  addOns?: ServiceAddOnDto[];

  @ApiPropertyOptional({ type: [ServiceRoomDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceRoomDto)
  rooms?: ServiceRoomDto[];

  @ApiPropertyOptional({ type: [ServiceDiscountDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDiscountDto)
  discounts?: ServiceDiscountDto[];
}

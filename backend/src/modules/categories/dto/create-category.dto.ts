import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryType } from '../../../common/enums';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Hotels, Apartments & Lodges' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ enum: CategoryType, example: CategoryType.STAY })
  @IsEnum(CategoryType)
  type!: CategoryType;

  @ApiPropertyOptional({ description: 'Slug; auto-generated from name when omitted' })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  slug?: string;

  @ApiPropertyOptional({ example: 'Hotel' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  iconName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  imageUrl?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Per-locale translations, e.g. { en: { name }, fr: { name }, mg: { name } }',
  })
  @IsOptional()
  @IsObject()
  translations?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Parent category id for sub-categories' })
  @IsOptional()
  @IsString()
  parentId?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

/** Create or update an admin-editable UI string keyed by `key`. */
export class UpsertLocaleStringDto {
  @ApiProperty({ example: 'home.hero.title' })
  @IsString()
  @MaxLength(160)
  key!: string;

  @ApiProperty({
    description: 'Translations map, e.g. { en: "...", fr: "...", mg: "..." }',
    example: { en: 'Welcome', fr: 'Bienvenue', mg: 'Tongasoa' },
  })
  @IsObject()
  translations!: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Optional grouping (e.g. "home", "checkout")' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;
}

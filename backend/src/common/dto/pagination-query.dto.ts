import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

/**
 * Shared query params for every list endpoint:
 *   ?page=1&limit=20&sort=field:asc|desc&query=...
 * Reused via `extends PaginationQueryDto` on per-module query DTOs.
 */
export class PaginationQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Sort expression `field:asc|desc`',
    example: 'createdAt:desc',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z][a-zA-Z0-9_]*:(asc|desc)$/, {
    message: 'sort must be in the form field:asc or field:desc',
  })
  sort?: string;

  @ApiPropertyOptional({ description: 'Free-text search term' })
  @IsOptional()
  @IsString()
  query?: string;
}

/**
 * Parses a `field:asc|desc` sort expression into a Prisma `orderBy` object,
 * restricted to an allow-list of sortable fields. Returns undefined when the
 * expression is absent or the field is not allowed.
 */
export function parseSort(
  sort: string | undefined,
  allowed: readonly string[],
): Record<string, 'asc' | 'desc'> | undefined {
  if (!sort) return undefined;
  const [field, direction] = sort.split(':');
  if (!allowed.includes(field)) return undefined;
  return { [field]: direction === 'asc' ? 'asc' : 'desc' };
}

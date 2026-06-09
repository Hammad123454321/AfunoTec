import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/** Fields supplied when a customer upgrades to a service provider. */
export class OnboardProviderDto {
  @ApiProperty({ example: 'Baobab Lodges Ltd' })
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  businessName!: string;

  @ApiPropertyOptional({ example: 'Baobab Lodges S.A.' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  legalName?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  taxId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'https://baobab-lodges.mg' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  websiteUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Payout details (bank or mobile money). Stored as opaque JSON.',
  })
  @IsOptional()
  @IsObject()
  payoutMethod?: Record<string, unknown>;
}

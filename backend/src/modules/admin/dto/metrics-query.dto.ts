import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class MetricsQueryDto {
  @ApiPropertyOptional({ description: 'Window start (ISO date). Defaults to 30 days ago.' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'Window end (ISO date). Defaults to now.' })
  @IsOptional()
  @IsDateString()
  to?: string;
}

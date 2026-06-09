import { ApiProperty } from '@nestjs/swagger';
import { ServiceStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ enum: ServiceStatus })
  @IsEnum(ServiceStatus)
  status!: ServiceStatus;
}

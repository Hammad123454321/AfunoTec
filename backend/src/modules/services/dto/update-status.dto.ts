import { ApiProperty } from '@nestjs/swagger';
import { ServiceStatus } from '../../../common/enums';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ enum: ServiceStatus })
  @IsEnum(ServiceStatus)
  status!: ServiceStatus;
}

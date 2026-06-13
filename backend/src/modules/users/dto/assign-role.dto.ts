import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums';
import { IsEnum } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role!: UserRole;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SetStatusDto {
  @ApiProperty({ description: 'Activate (true) or deactivate (false) the account' })
  @IsBoolean()
  isActive!: boolean;
}

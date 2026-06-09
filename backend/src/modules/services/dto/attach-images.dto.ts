import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { ServiceImageDto } from './nested.dto';

export class AttachImagesDto {
  @ApiProperty({ type: [ServiceImageDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ServiceImageDto)
  images!: ServiceImageDto[];
}

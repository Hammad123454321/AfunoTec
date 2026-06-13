import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotImplementedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class PresignDto {
  @ApiProperty()
  @IsString()
  contentType: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  sizeBytes: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prefix?: string;
}

class ConfirmUploadDto {
  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  contentType: string;

  @ApiProperty()
  @IsInt()
  size: number;
}

@ApiTags('Uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  @Post('presign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a pre-signed upload URL (Milestone 3 — R2 creds required)' })
  presign(@Body() _dto: PresignDto) {
    throw new NotImplementedException('File uploads require R2 credentials (Milestone 3)');
  }

  @Post('confirm')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Confirm a completed upload (Milestone 3)' })
  confirm(@Body() _dto: ConfirmUploadDto) {
    throw new NotImplementedException('File uploads require R2 credentials (Milestone 3)');
  }

  @Delete(':fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an uploaded file (Milestone 3)' })
  remove(@Param('fileId') _fileId: string) {
    throw new NotImplementedException('File uploads require R2 credentials (Milestone 3)');
  }
}

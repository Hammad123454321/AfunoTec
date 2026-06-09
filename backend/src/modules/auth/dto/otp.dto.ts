import { ApiProperty } from '@nestjs/swagger';
import { OtpPurpose } from '@prisma/client';
import { IsEnum, IsString, Length, MaxLength } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({ description: 'Email or phone number', example: 'jane@example.com' })
  @IsString()
  @MaxLength(120)
  identifier!: string;

  @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.EMAIL_VERIFY })
  @IsEnum(OtpPurpose)
  purpose!: OtpPurpose;
}

export class VerifyOtpDto {
  @ApiProperty({ description: 'Email or phone number', example: 'jane@example.com' })
  @IsString()
  @MaxLength(120)
  identifier!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(4, 8)
  otp!: string;

  @ApiProperty({ enum: OtpPurpose, example: OtpPurpose.EMAIL_VERIFY })
  @IsEnum(OtpPurpose)
  purpose!: OtpPurpose;
}

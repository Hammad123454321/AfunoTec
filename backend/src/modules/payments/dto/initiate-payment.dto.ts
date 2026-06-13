import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaymentMethod } from '../../../common/enums';

export class InitiatePaymentDto {
  @ApiProperty({ description: 'Booking id to pay for' })
  @IsUUID()
  bookingId: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ description: 'Phone / token supplied by the mobile-money gateway' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  phoneOrToken?: string;
}

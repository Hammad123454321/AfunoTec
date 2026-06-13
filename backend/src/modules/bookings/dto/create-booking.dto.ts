import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  IsEmail,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GuestDto {
  @ApiProperty()
  @IsString()
  @MaxLength(80)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  roomIndex?: number;
}

export class BookingRoomRequestDto {
  @ApiProperty()
  @IsUUID()
  roomId: string;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  qty: number;
}

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  serviceId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  checkInDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  checkOutDate?: string;

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  units?: number;

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  adults?: number;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  childrenAges?: number[];

  @ApiPropertyOptional({ type: [BookingRoomRequestDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingRoomRequestDto)
  rooms?: BookingRoomRequestDto[];

  @ApiPropertyOptional({ type: [GuestDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  guests?: GuestDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Currency code for price display (default MGA)' })
  @IsOptional()
  @IsString()
  currency?: string;
}

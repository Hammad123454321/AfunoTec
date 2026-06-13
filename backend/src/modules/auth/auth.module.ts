import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { Cart, CartSchema } from '../../database/schemas/cart.schema';
import {
  CustomerProfile,
  CustomerProfileSchema,
} from '../../database/schemas/customer-profile.schema';
import {
  ServiceProviderProfile,
  ServiceProviderProfileSchema,
} from '../../database/schemas/service-provider-profile.schema';
import { RefreshToken, RefreshTokenSchema } from '../../database/schemas/refresh-token.schema';
import { OtpToken, OtpTokenSchema } from '../../database/schemas/otp-token.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { OtpService } from './otp.service';

/**
 * Authentication: register, login (with lockout), DB-backed refresh rotation,
 * logout, password reset, OTP, and `/auth/me`.
 *
 * JwtModule + Passport come from the global AuthCoreModule; MailQueue from the
 * global MailModule; AuditService from the global AuditModule; Mongoose models
 * via MongooseModule.forFeature below.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
      { name: CustomerProfile.name, schema: CustomerProfileSchema },
      { name: ServiceProviderProfile.name, schema: ServiceProviderProfileSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: OtpToken.name, schema: OtpTokenSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, TokenService, OtpService],
  exports: [PasswordService, TokenService, MongooseModule],
})
export class AuthModule {}

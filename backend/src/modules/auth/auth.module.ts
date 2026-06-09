import { Module } from '@nestjs/common';
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
 * global MailModule; AuditService from the global AuditModule; PrismaService
 * from the global PrismaModule.
 */
@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService, TokenService, OtpService],
  exports: [PasswordService, TokenService],
})
export class AuthModule {}

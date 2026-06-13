import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';

// Per-route throttle limits are configurable via env vars so test environments
// can raise the cap (AUTH_THROTTLE_LIMIT=10000) without touching production defaults.
const authThrottleLimit = (): number =>
  parseInt(process.env.AUTH_THROTTLE_LIMIT ?? '5', 10);
const authThrottleTtl = (): number =>
  parseInt(process.env.AUTH_THROTTLE_TTL ?? '60000', 10);
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { AuthService, RequestContext } from './auth.service';
import { TokenPair } from './token.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/password.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private ctx(req: Request): RequestContext {
    return { ip: req.ip ?? null, userAgent: req.header('user-agent') ?? null };
  }

  /** Sets httpOnly cookies for both tokens, scoped to their lifetimes. */
  private setAuthCookies(res: Response, tokens: TokenPair): void {
    const secure = process.env.NODE_ENV === 'production';
    const common = { httpOnly: true, secure, sameSite: 'lax' as const, path: '/' };
    res.cookie('accessToken', tokens.accessToken, {
      ...common,
      maxAge: tokens.accessExpiresIn * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...common,
      maxAge: tokens.refreshExpiresIn * 1000,
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }

  @Post('register')
  @Public()
  @Throttle({ default: { limit: authThrottleLimit(), ttl: authThrottleTtl() } })
  @ApiOperation({ summary: 'Register a new customer account' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.register(dto);
    this.setAuthCookies(res, result.tokens);
    return result;
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: authThrottleLimit(), ttl: authThrottleTtl() } })
  @ApiOperation({ summary: 'Authenticate and receive access + refresh tokens' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.auth.login(dto, this.ctx(req));
    this.setAuthCookies(res, result.tokens);
    return result;
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: authThrottleLimit(), ttl: authThrottleTtl() } })
  @ApiOperation({ summary: 'Rotate the refresh token and issue a new token pair' })
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieToken = (req.cookies as Record<string, string> | undefined)?.refreshToken;
    const token = dto.refreshToken ?? cookieToken ?? '';
    const tokens = await this.auth.refresh(token, this.ctx(req));
    this.setAuthCookies(res, tokens);
    return { tokens };
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke the current refresh token and clear cookies' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookieToken = (req.cookies as Record<string, string> | undefined)?.refreshToken;
    await this.auth.logout(cookieToken);
    this.clearAuthCookies(res);
    return { success: true };
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: authThrottleLimit(), ttl: authThrottleTtl() } })
  @ApiOperation({ summary: 'Request a password-reset code (always returns 200)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.auth.forgotPassword(dto.email);
    return { message: 'If the account exists, a reset code has been sent' };
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: authThrottleLimit(), ttl: authThrottleTtl() } })
  @ApiOperation({ summary: 'Reset password using an emailed code' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.auth.resetPassword(dto);
    return { message: 'Password has been reset' };
  }

  @Post('change-password')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password for the authenticated user' })
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.auth.changePassword(user.id, dto.currentPassword, dto.newPassword);
    return { message: 'Password updated' };
  }

  @Post('otp/send')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: authThrottleLimit(), ttl: authThrottleTtl() } })
  @ApiOperation({ summary: 'Send (or resend) an OTP for the given identifier and purpose' })
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.auth.sendOtp(dto);
    return { message: 'Verification code sent' };
  }

  @Post('otp/verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: authThrottleLimit(), ttl: authThrottleTtl() } })
  @ApiOperation({ summary: 'Verify an OTP' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.auth.verifyOtp(dto);
    return { message: 'Verified' };
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current authenticated user' })
  async me(@CurrentUser() user: AuthUser) {
    return this.auth.me(user.id);
  }
}

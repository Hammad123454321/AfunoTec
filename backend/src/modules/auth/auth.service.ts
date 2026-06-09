import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpPurpose, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { MailQueue } from '../../common/queue/mail.queue';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { PasswordService } from './password.service';
import { TokenService, TokenPair } from './token.service';
import { OtpService } from './otp.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/password.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';

export interface RequestContext {
  ip?: string | null;
  userAgent?: string | null;
}

/** Shape returned to clients — never includes the password hash. */
export type PublicUser = Omit<User, 'passwordHash'>;

export interface AuthResult {
  user: PublicUser;
  tokens: TokenPair;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly tokens: TokenService,
    private readonly otp: OtpService,
    private readonly mailQueue: MailQueue,
    private readonly audit: AuditService,
    private readonly config: ConfigService,
  ) {}

  private stripPassword(user: User): PublicUser {
    const { passwordHash: _omit, ...rest } = user;
    return rest;
  }

  /** Registers a CUSTOMER, provisions an empty cart, and dispatches an email-verify OTP. */
  async register(dto: RegisterDto): Promise<AuthResult> {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await this.password.hash(dto.password);

    const user = await this.prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email,
          name: dto.name.trim(),
          phone: dto.phone?.trim() || null,
          passwordHash,
          role: 'CUSTOMER',
        },
      });
      await tx.cart.create({ data: { userId: created.id } });
      return created;
    });

    // Email verification OTP (delivery is queued; non-blocking).
    const issued = await this.otp.issue({
      identifier: email,
      purpose: OtpPurpose.EMAIL_VERIFY,
      userId: user.id,
    });
    await this.mailQueue.enqueueOtp({
      to: email,
      code: issued.code,
      purpose: 'email verification',
    });
    await this.mailQueue.enqueueWelcome({ to: email, name: user.name });

    const tokens = await this.tokens.issuePair(user);
    return { user: this.stripPassword(user), tokens };
  }

  /** Authenticates by email+password with account lockout on repeated failures. */
  async login(dto: LoginDto, ctx: RequestContext): Promise<AuthResult> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Uniform failure (no user enumeration) for missing user / wrong password.
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }
    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      throw new BusinessRuleException(
        'Account is temporarily locked due to repeated failed logins. Try again later.',
      );
    }

    const ok = await this.password.verify(user.passwordHash, dto.password);
    if (!ok) {
      await this.registerFailedLogin(user);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Success — reset lockout counters, stamp last login.
    const fresh = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        lastLoginIp: ctx.ip ?? null,
      },
    });

    const tokens = await this.tokens.issuePair(fresh, ctx);
    await this.audit.record({
      actorId: fresh.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: fresh.id,
      ip: ctx.ip,
      userAgent: ctx.userAgent,
    });
    return { user: this.stripPassword(fresh), tokens };
  }

  /** Increments the failed-login counter and applies a lock once the threshold is hit. */
  private async registerFailedLogin(user: User): Promise<void> {
    const threshold = this.config.get<number>('jwt.lockoutThreshold') ?? 5;
    const durationSeconds = this.config.get<number>('jwt.lockoutDurationSeconds') ?? 900;
    const nextCount = user.failedLoginCount + 1;
    const data: Prisma.UserUpdateInput = { failedLoginCount: nextCount };
    if (nextCount >= threshold) {
      data.lockedUntil = new Date(Date.now() + durationSeconds * 1000);
      data.failedLoginCount = 0; // reset so the next window starts clean after unlock
    }
    await this.prisma.user.update({ where: { id: user.id }, data });
  }

  /** Rotates the presented refresh token, returning a new token pair. */
  async refresh(token: string, ctx: RequestContext): Promise<TokenPair> {
    if (!token) throw new UnauthorizedException('Refresh token is required');
    return this.tokens.rotate(token, ctx);
  }

  /** Revokes the presented refresh token (logout). */
  async logout(token: string | undefined): Promise<void> {
    if (token) await this.tokens.revoke(token);
  }

  /** Always returns 200 to avoid user enumeration; sends a reset OTP if the account exists. */
  async forgotPassword(email: string): Promise<void> {
    const normalized = email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email: normalized } });
    if (!user || user.deletedAt) return;

    const issued = await this.otp.issue({
      identifier: normalized,
      purpose: OtpPurpose.PASSWORD_RESET,
      userId: user.id,
    });
    await this.mailQueue.enqueuePasswordReset({ to: normalized, code: issued.code });
  }

  /** Verifies the reset OTP, sets a new password, and revokes all sessions. */
  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.deletedAt) {
      throw new BusinessRuleException('Unable to reset password for this account');
    }

    await this.otp.verify({
      identifier: email,
      purpose: OtpPurpose.PASSWORD_RESET,
      code: dto.otp,
    });

    const passwordHash = await this.password.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, failedLoginCount: 0, lockedUntil: null },
    });
    await this.tokens.revokeAllForUser(user.id);
    await this.audit.record({ actorId: user.id, action: 'PASSWORD_RESET', entity: 'User', entityId: user.id });
  }

  /** Changes the password for an authenticated user and revokes other sessions. */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const ok = await this.password.verify(user.passwordHash, currentPassword);
    if (!ok) throw new BusinessRuleException('Current password is incorrect');

    const passwordHash = await this.password.hash(newPassword);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    await this.tokens.revokeAllForUser(userId);
    await this.audit.record({ actorId: userId, action: 'PASSWORD_CHANGE', entity: 'User', entityId: userId });
  }

  /** (Re)sends an OTP for an identifier+purpose. */
  async sendOtp(dto: SendOtpDto): Promise<void> {
    const identifier = dto.identifier.toLowerCase().trim();
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
      select: { id: true },
    });
    const issued = await this.otp.issue({
      identifier,
      purpose: dto.purpose,
      userId: user?.id ?? null,
    });
    await this.mailQueue.enqueueOtp({
      to: identifier,
      code: issued.code,
      purpose: dto.purpose.toLowerCase().replace('_', ' '),
    });
  }

  /** Verifies an OTP and marks the corresponding verification flag when applicable. */
  async verifyOtp(dto: VerifyOtpDto): Promise<void> {
    const identifier = dto.identifier.toLowerCase().trim();
    await this.otp.verify({ identifier, purpose: dto.purpose, code: dto.otp });

    if (dto.purpose === OtpPurpose.EMAIL_VERIFY) {
      await this.prisma.user.updateMany({
        where: { email: identifier, emailVerifiedAt: null },
        data: { emailVerifiedAt: new Date() },
      });
    } else if (dto.purpose === OtpPurpose.PHONE_VERIFY) {
      await this.prisma.user.updateMany({
        where: { phone: identifier, phoneVerifiedAt: null },
        data: { phoneVerifiedAt: new Date() },
      });
    }
  }

  /** Returns the current user's profile (with customer/provider extension). */
  async me(userId: string): Promise<PublicUser & { customerProfile: unknown; serviceProviderProfile: unknown }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { customerProfile: true, serviceProviderProfile: true },
    });
    if (!user || user.deletedAt) throw new UnauthorizedException();
    const { passwordHash: _omit, ...rest } = user;
    return rest;
  }
}

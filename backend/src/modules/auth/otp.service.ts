import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import { OtpPurpose } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PasswordService } from './password.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';

export interface IssuedOtp {
  code: string;
  expiresAt: Date;
}

/**
 * Issues and verifies one-time codes for email/phone verification, password
 * reset and 2FA. Codes are random numeric strings, hashed at rest (argon2),
 * TTL-bounded, and attempt-limited.
 */
@Injectable()
export class OtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly password: PasswordService,
    private readonly config: ConfigService,
  ) {}

  private generateCode(length: number): string {
    let code = '';
    for (let i = 0; i < length; i += 1) {
      code += randomInt(0, 10).toString();
    }
    return code;
  }

  /**
   * Issues a fresh OTP for an identifier+purpose, invalidating any prior
   * unconsumed codes for that pair. Returns the plaintext code so the caller
   * can enqueue delivery.
   */
  async issue(params: {
    identifier: string;
    purpose: OtpPurpose;
    userId?: string | null;
  }): Promise<IssuedOtp> {
    const length = this.config.get<number>('jwt.otpLength') ?? 6;
    const ttl = this.config.get<number>('jwt.otpTtlSeconds') ?? 300;
    const code = this.generateCode(length);
    const codeHash = await this.password.hash(code);
    const expiresAt = new Date(Date.now() + ttl * 1000);

    await this.prisma.$transaction([
      // Invalidate previous unconsumed codes for this identifier+purpose.
      this.prisma.otpToken.updateMany({
        where: { identifier: params.identifier, purpose: params.purpose, consumedAt: null },
        data: { consumedAt: new Date() },
      }),
      this.prisma.otpToken.create({
        data: {
          identifier: params.identifier,
          purpose: params.purpose,
          userId: params.userId ?? null,
          codeHash,
          expiresAt,
        },
      }),
    ]);

    return { code, expiresAt };
  }

  /**
   * Verifies and consumes an OTP. Throws 422 on missing/expired/exhausted/
   * incorrect codes; increments the attempt counter on a wrong code.
   */
  async verify(params: {
    identifier: string;
    purpose: OtpPurpose;
    code: string;
  }): Promise<void> {
    const maxAttempts = this.config.get<number>('jwt.otpMaxAttempts') ?? 5;

    const token = await this.prisma.otpToken.findFirst({
      where: { identifier: params.identifier, purpose: params.purpose, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!token) {
      throw new BusinessRuleException('No active verification code; request a new one');
    }
    if (token.expiresAt.getTime() < Date.now()) {
      throw new BusinessRuleException('Verification code has expired; request a new one');
    }
    if (token.attempts >= maxAttempts) {
      await this.prisma.otpToken.update({
        where: { id: token.id },
        data: { consumedAt: new Date() },
      });
      throw new BusinessRuleException('Too many attempts; request a new code');
    }

    const ok = await this.password.verify(token.codeHash, params.code);
    if (!ok) {
      await this.prisma.otpToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } },
      });
      throw new BusinessRuleException('Incorrect verification code');
    }

    await this.prisma.otpToken.update({
      where: { id: token.id },
      data: { consumedAt: new Date() },
    });
  }
}

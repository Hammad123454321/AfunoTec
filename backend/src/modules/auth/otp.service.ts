import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomInt } from 'crypto';
import { Model } from 'mongoose';
import { OtpPurpose } from '../../common/enums';
import { OtpToken, OtpTokenDocument } from '../../database/schemas/otp-token.schema';
import { TransactionService } from '../../database/transaction.service';
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
    @InjectModel(OtpToken.name) private readonly otpModel: Model<OtpTokenDocument>,
    private readonly password: PasswordService,
    private readonly config: ConfigService,
    private readonly tx: TransactionService,
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

    await this.tx.run(async (session) => {
      // Invalidate previous unconsumed codes for this identifier+purpose.
      await this.otpModel.updateMany(
        { identifier: params.identifier, purpose: params.purpose, consumedAt: null },
        { $set: { consumedAt: new Date() } },
        { session },
      );
      await this.otpModel.create(
        [
          {
            identifier: params.identifier,
            purpose: params.purpose,
            userId: params.userId ?? null,
            codeHash,
            expiresAt,
          },
        ],
        { session },
      );
    });

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

    const token = await this.otpModel
      .findOne({ identifier: params.identifier, purpose: params.purpose, consumedAt: null })
      .sort({ createdAt: -1 })
      .exec();

    if (!token) {
      throw new BusinessRuleException('No active verification code; request a new one');
    }
    if (token.expiresAt.getTime() < Date.now()) {
      throw new BusinessRuleException('Verification code has expired; request a new one');
    }
    if (token.attempts >= maxAttempts) {
      await this.otpModel.updateOne({ _id: token._id }, { $set: { consumedAt: new Date() } });
      throw new BusinessRuleException('Too many attempts; request a new code');
    }

    const ok = await this.password.verify(token.codeHash, params.code);
    if (!ok) {
      await this.otpModel.updateOne({ _id: token._id }, { $inc: { attempts: 1 } });
      throw new BusinessRuleException('Incorrect verification code');
    }

    await this.otpModel.updateOne({ _id: token._id }, { $set: { consumedAt: new Date() } });
  }
}

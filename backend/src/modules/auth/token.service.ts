import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { createHash, randomBytes } from 'crypto';
import { Model } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from '../../database/schemas/refresh-token.schema';
import { User } from '../../database/schemas/user.schema';
import { UserRole } from '../../common/enums';
import { TransactionService } from '../../database/transaction.service';
import { JwtPayload } from '../../common/strategies/jwt.strategy';

/** Minimal user shape needed to mint tokens. */
type TokenUser = { id: string; email: string; role: UserRole | string };

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number; // seconds
  refreshExpiresIn: number; // seconds
}

interface IssueContext {
  userAgent?: string | null;
  ip?: string | null;
}

/**
 * Issues short-lived JWT access tokens and manages DB-backed refresh tokens
 * with rotation and theft (reuse) detection. Refresh tokens are opaque random
 * strings; only their sha256 hash is stored.
 */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly tx: TransactionService,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private signAccessToken(user: TokenUser): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };
    return this.jwt.sign(payload, {
      secret: this.config.get<string>('jwt.accessSecret'),
      expiresIn: this.config.get<number>('jwt.accessTtl') ?? 900,
    });
  }

  /** Issues a fresh access+refresh pair and persists the refresh token hash. */
  async issuePair(
    user: TokenUser,
    ctx: IssueContext = {},
  ): Promise<TokenPair> {
    const accessTtl = this.config.get<number>('jwt.accessTtl') ?? 900;
    const refreshTtl = this.config.get<number>('jwt.refreshTtl') ?? 604800;

    const accessToken = this.signAccessToken(user);
    const refreshToken = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + refreshTtl * 1000);

    await this.refreshTokenModel.create({
      userId: user.id,
      tokenHash: this.hashToken(refreshToken),
      userAgent: ctx.userAgent ?? null,
      ip: ctx.ip ?? null,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      accessExpiresIn: accessTtl,
      refreshExpiresIn: refreshTtl,
    };
  }

  /**
   * Rotates a refresh token: validates the presented token, revokes it, and
   * issues a new pair — all in one transaction. If a *already-revoked* token is
   * presented (reuse/theft), every session for that user is revoked.
   */
  async rotate(presentedToken: string, ctx: IssueContext = {}): Promise<TokenPair> {
    const tokenHash = this.hashToken(presentedToken);
    const existing = await this.refreshTokenModel
      .findOne({ tokenHash })
      .populate<{ userId: { _id: unknown; email: string; role: string; isActive: boolean; deletedAt?: Date | null } }>(
        'userId',
        'email role isActive deletedAt',
      )
      .exec();

    if (!existing) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const populatedUser = existing.userId as unknown as {
      _id: unknown;
      email: string;
      role: string;
      isActive: boolean;
      deletedAt?: Date | null;
    } | null;
    const ownerId = populatedUser?._id?.toString();

    // Reuse detection: a revoked token being presented means it may be stolen.
    if (existing.revokedAt) {
      if (ownerId) await this.revokeAllForUser(ownerId);
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (existing.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    if (!populatedUser || populatedUser.deletedAt || !populatedUser.isActive) {
      throw new UnauthorizedException('Account is inactive or no longer exists');
    }

    const user: TokenUser = {
      id: ownerId!,
      email: populatedUser.email,
      role: populatedUser.role,
    };

    const refreshTtl = this.config.get<number>('jwt.refreshTtl') ?? 604800;
    const accessTtl = this.config.get<number>('jwt.accessTtl') ?? 900;
    const newRefresh = randomBytes(48).toString('hex');
    const newExpiresAt = new Date(Date.now() + refreshTtl * 1000);

    await this.tx.run(async (session) => {
      await this.refreshTokenModel.updateOne(
        { _id: existing._id },
        { $set: { revokedAt: new Date() } },
        { session },
      );
      await this.refreshTokenModel.create(
        [
          {
            userId: user.id,
            tokenHash: this.hashToken(newRefresh),
            userAgent: ctx.userAgent ?? null,
            ip: ctx.ip ?? null,
            expiresAt: newExpiresAt,
          },
        ],
        { session },
      );
    });

    return {
      accessToken: this.signAccessToken(user),
      refreshToken: newRefresh,
      accessExpiresIn: accessTtl,
      refreshExpiresIn: refreshTtl,
    };
  }

  /** Revokes a single refresh token by its raw value (used on logout). */
  async revoke(presentedToken: string): Promise<void> {
    const tokenHash = this.hashToken(presentedToken);
    await this.refreshTokenModel.updateMany(
      { tokenHash, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
  }

  /** Revokes every active refresh token for a user (password change, theft, deactivation). */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.refreshTokenModel.updateMany(
      { userId, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    );
  }
}

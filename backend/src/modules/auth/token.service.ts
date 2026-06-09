import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { User } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtPayload } from '../../common/strategies/jwt.strategy';

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
    private readonly prisma: PrismaService,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private signAccessToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
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
    user: Pick<User, 'id' | 'email' | 'role'>,
    ctx: IssueContext = {},
  ): Promise<TokenPair> {
    const accessTtl = this.config.get<number>('jwt.accessTtl') ?? 900;
    const refreshTtl = this.config.get<number>('jwt.refreshTtl') ?? 604800;

    const accessToken = this.signAccessToken(user);
    const refreshToken = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + refreshTtl * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        userAgent: ctx.userAgent ?? null,
        ip: ctx.ip ?? null,
        expiresAt,
      },
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
    const existing = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { select: { id: true, email: true, role: true, isActive: true, deletedAt: true } } },
    });

    if (!existing) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Reuse detection: a revoked token being presented means it may be stolen.
    if (existing.revokedAt) {
      await this.revokeAllForUser(existing.userId);
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (existing.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const user = existing.user;
    if (!user || user.deletedAt || !user.isActive) {
      throw new UnauthorizedException('Account is inactive or no longer exists');
    }

    const refreshTtl = this.config.get<number>('jwt.refreshTtl') ?? 604800;
    const accessTtl = this.config.get<number>('jwt.accessTtl') ?? 900;
    const newRefresh = randomBytes(48).toString('hex');
    const newExpiresAt = new Date(Date.now() + refreshTtl * 1000);

    await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: existing.id },
        data: { revokedAt: new Date() },
      }),
      this.prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: this.hashToken(newRefresh),
          userAgent: ctx.userAgent ?? null,
          ip: ctx.ip ?? null,
          expiresAt: newExpiresAt,
        },
      }),
    ]);

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
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /** Revokes every active refresh token for a user (password change, theft, deactivation). */
  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}

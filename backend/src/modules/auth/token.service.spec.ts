import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TokenService } from './token.service';

const CONFIG: Record<string, number | string> = {
  'jwt.accessSecret': 'test-secret',
  'jwt.accessTtl': 900,
  'jwt.refreshTtl': 604800,
};

function activeUser() {
  return {
    id: 'u1',
    email: 'jane@example.com',
    role: UserRole.CUSTOMER,
    isActive: true,
    deletedAt: null,
  };
}

describe('TokenService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let jwt: DeepMockProxy<JwtService>;
  let service: TokenService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    jwt = mockDeep<JwtService>();
    jwt.sign.mockReturnValue('signed.jwt.token');
    const config = { get: (k: string) => CONFIG[k] } as unknown as ConfigService;
    service = new TokenService(jwt, config, prisma);
  });

  describe('issuePair', () => {
    it('signs an access token and persists a hashed refresh token', async () => {
      prisma.refreshToken.create.mockResolvedValue({} as any);
      const pair = await service.issuePair(activeUser());

      expect(pair.accessToken).toBe('signed.jwt.token');
      expect(pair.refreshToken).toHaveLength(96); // 48 bytes hex
      const createArg = prisma.refreshToken.create.mock.calls[0][0] as any;
      // raw token is never stored — only its hash
      expect(createArg.data.tokenHash).not.toBe(pair.refreshToken);
      expect(createArg.data.tokenHash).toHaveLength(64); // sha256 hex
    });
  });

  describe('rotate', () => {
    it('rejects an unknown refresh token', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue(null);
      await expect(service.rotate('nope')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('revokes the old token and issues a new pair on success', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1',
        userId: 'u1',
        revokedAt: null,
        expiresAt: new Date(Date.now() + 60_000),
        user: activeUser(),
      } as any);
      prisma.$transaction.mockResolvedValue([] as any);

      const pair = await service.rotate('valid-token');
      expect(pair.refreshToken).toHaveLength(96);
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('detects reuse: presenting a revoked token revokes ALL sessions and throws', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1',
        userId: 'u1',
        revokedAt: new Date(), // already revoked → reuse/theft
        expiresAt: new Date(Date.now() + 60_000),
        user: activeUser(),
      } as any);

      await expect(service.rotate('stolen-token')).rejects.toBeInstanceOf(UnauthorizedException);
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ userId: 'u1' }) }),
      );
    });

    it('rejects an expired refresh token', async () => {
      prisma.refreshToken.findUnique.mockResolvedValue({
        id: 'rt1',
        userId: 'u1',
        revokedAt: null,
        expiresAt: new Date(Date.now() - 1000),
        user: activeUser(),
      } as any);
      await expect(service.rotate('expired')).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});

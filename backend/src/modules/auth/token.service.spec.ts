import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model } from 'mongoose';
import { UserRole } from '../../common/enums';
import { RefreshTokenDocument } from '../../database/schemas/refresh-token.schema';
import { TransactionService } from '../../database/transaction.service';
import { TokenService } from './token.service';

const CONFIG: Record<string, number | string> = {
  'jwt.accessSecret': 'test-secret',
  'jwt.accessTtl': 900,
  'jwt.refreshTtl': 604800,
};

function activeUser() {
  return { id: 'u1', email: 'jane@example.com', role: UserRole.CUSTOMER };
}

/** Builds a populated refresh-token doc as findOne().populate().exec() would return. */
function refreshDoc(overrides: Record<string, unknown> = {}) {
  return {
    _id: 'rt1',
    userId: {
      _id: 'u1',
      email: 'jane@example.com',
      role: UserRole.CUSTOMER,
      isActive: true,
      deletedAt: null,
    },
    revokedAt: null,
    expiresAt: new Date(Date.now() + 60_000),
    ...overrides,
  };
}

describe('TokenService', () => {
  let model: DeepMockProxy<Model<RefreshTokenDocument>>;
  let jwt: DeepMockProxy<JwtService>;
  let tx: DeepMockProxy<TransactionService>;
  let service: TokenService;

  beforeEach(() => {
    model = mockDeep<Model<RefreshTokenDocument>>();
    jwt = mockDeep<JwtService>();
    tx = mockDeep<TransactionService>();
    jwt.sign.mockReturnValue('signed.jwt.token');
    // run() simply executes the unit of work with a dummy session.
    tx.run.mockImplementation(async (work) => work({} as never));
    const config = { get: (k: string) => CONFIG[k] } as unknown as ConfigService;
    service = new TokenService(jwt, config, model, tx);
  });

  /** Stubs findOne(...).populate(...).exec() to resolve to `value`. */
  function stubFindOne(value: unknown) {
    const chain = {
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(value),
    };
    model.findOne.mockReturnValue(chain as never);
    return chain;
  }

  describe('issuePair', () => {
    it('signs an access token and persists a hashed refresh token', async () => {
      model.create.mockResolvedValue({} as never);
      const pair = await service.issuePair(activeUser());

      expect(pair.accessToken).toBe('signed.jwt.token');
      expect(pair.refreshToken).toHaveLength(96); // 48 bytes hex
      const createArg = model.create.mock.calls[0][0] as { tokenHash: string };
      // raw token is never stored — only its hash
      expect(createArg.tokenHash).not.toBe(pair.refreshToken);
      expect(createArg.tokenHash).toHaveLength(64); // sha256 hex
    });
  });

  describe('rotate', () => {
    it('rejects an unknown refresh token', async () => {
      stubFindOne(null);
      await expect(service.rotate('nope')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('revokes the old token and issues a new pair on success', async () => {
      stubFindOne(refreshDoc());
      model.updateOne.mockResolvedValue({} as never);
      model.create.mockResolvedValue([{}] as never);

      const pair = await service.rotate('valid-token');
      expect(pair.refreshToken).toHaveLength(96);
      expect(tx.run).toHaveBeenCalled();
    });

    it('detects reuse: presenting a revoked token revokes ALL sessions and throws', async () => {
      stubFindOne(refreshDoc({ revokedAt: new Date() })); // already revoked → reuse/theft
      model.updateMany.mockResolvedValue({} as never);

      await expect(service.rotate('stolen-token')).rejects.toBeInstanceOf(UnauthorizedException);
      expect(model.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'u1', revokedAt: null }),
        expect.anything(),
      );
    });

    it('rejects an expired refresh token', async () => {
      stubFindOne(refreshDoc({ expiresAt: new Date(Date.now() - 1000) }));
      await expect(service.rotate('expired')).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});

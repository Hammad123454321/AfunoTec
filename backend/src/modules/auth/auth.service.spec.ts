import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../../common/audit/audit.service';
import { MailQueue } from '../../common/queue/mail.queue';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { OtpService } from './otp.service';

const CONFIG: Record<string, number> = {
  'jwt.lockoutThreshold': 5,
  'jwt.lockoutDurationSeconds': 900,
};

function makeUser(overrides: Partial<any> = {}) {
  return {
    id: 'u1',
    email: 'jane@example.com',
    name: 'Jane',
    phone: null,
    passwordHash: 'hashed',
    role: 'CUSTOMER',
    isActive: true,
    deletedAt: null,
    failedLoginCount: 0,
    lockedUntil: null,
    ...overrides,
  };
}

describe('AuthService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let password: DeepMockProxy<PasswordService>;
  let tokens: DeepMockProxy<TokenService>;
  let otp: DeepMockProxy<OtpService>;
  let mailQueue: DeepMockProxy<MailQueue>;
  let audit: DeepMockProxy<AuditService>;
  let service: AuthService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    password = mockDeep<PasswordService>();
    tokens = mockDeep<TokenService>();
    otp = mockDeep<OtpService>();
    mailQueue = mockDeep<MailQueue>();
    audit = mockDeep<AuditService>();
    const config = { get: (k: string) => CONFIG[k] } as unknown as ConfigService;

    service = new AuthService(prisma, password, tokens, otp, mailQueue, audit, config);
    tokens.issuePair.mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'r',
      accessExpiresIn: 900,
      refreshExpiresIn: 604800,
    });
  });

  describe('register', () => {
    it('rejects a duplicate email with 409', async () => {
      prisma.user.findUnique.mockResolvedValue(makeUser() as any);
      await expect(
        service.register({ name: 'Jane', email: 'jane@example.com', password: 'S3curePass!' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('creates a CUSTOMER, issues an OTP, and returns tokens without the password hash', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      password.hash.mockResolvedValue('hashed');
      const created = makeUser();
      // $transaction is called with a callback in register()
      prisma.$transaction.mockImplementation(async (cb: any) =>
        cb({
          user: { create: jest.fn().mockResolvedValue(created) },
          cart: { create: jest.fn().mockResolvedValue({}) },
        }),
      );
      otp.issue.mockResolvedValue({ code: '123456', expiresAt: new Date() });

      const result = await service.register({
        name: 'Jane',
        email: 'jane@example.com',
        password: 'S3curePass!',
      });

      expect(otp.issue).toHaveBeenCalled();
      expect(mailQueue.enqueueOtp).toHaveBeenCalled();
      expect((result.user as any).passwordHash).toBeUndefined();
      expect(result.tokens.accessToken).toBe('a');
    });
  });

  describe('login lockout', () => {
    it('increments failedLoginCount on a wrong password', async () => {
      const user = makeUser({ failedLoginCount: 1 });
      prisma.user.findUnique.mockResolvedValue(user as any);
      password.verify.mockResolvedValue(false);

      await expect(
        service.login({ email: user.email, password: 'wrong' }, {}),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ failedLoginCount: 2 }) }),
      );
    });

    it('applies a lock once the threshold is reached', async () => {
      const user = makeUser({ failedLoginCount: 4 }); // next attempt is the 5th
      prisma.user.findUnique.mockResolvedValue(user as any);
      password.verify.mockResolvedValue(false);

      await expect(
        service.login({ email: user.email, password: 'wrong' }, {}),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      const updateArg = prisma.user.update.mock.calls[0][0] as any;
      expect(updateArg.data.lockedUntil).toBeInstanceOf(Date);
      expect(updateArg.data.failedLoginCount).toBe(0);
    });

    it('rejects login while the account is locked (422), without checking the password', async () => {
      const user = makeUser({ lockedUntil: new Date(Date.now() + 60_000) });
      prisma.user.findUnique.mockResolvedValue(user as any);

      await expect(
        service.login({ email: user.email, password: 'Correct1!' }, {}),
      ).rejects.toBeInstanceOf(BusinessRuleException);
      expect(password.verify).not.toHaveBeenCalled();
    });

    it('resets counters and issues tokens on success', async () => {
      const user = makeUser({ failedLoginCount: 3 });
      prisma.user.findUnique.mockResolvedValue(user as any);
      password.verify.mockResolvedValue(true);
      prisma.user.update.mockResolvedValue(makeUser({ failedLoginCount: 0 }) as any);

      const result = await service.login({ email: user.email, password: 'Correct1!' }, { ip: '1.2.3.4' });

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ failedLoginCount: 0, lockedUntil: null }),
        }),
      );
      expect(result.tokens.accessToken).toBe('a');
    });
  });

  describe('refresh', () => {
    it('delegates rotation to the TokenService', async () => {
      tokens.rotate.mockResolvedValue({
        accessToken: 'a2',
        refreshToken: 'r2',
        accessExpiresIn: 900,
        refreshExpiresIn: 604800,
      });
      const pair = await service.refresh('some-token', { ip: '1.2.3.4' });
      expect(tokens.rotate).toHaveBeenCalledWith('some-token', { ip: '1.2.3.4' });
      expect(pair.refreshToken).toBe('r2');
    });

    it('rejects an empty refresh token', async () => {
      await expect(service.refresh('', {})).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});

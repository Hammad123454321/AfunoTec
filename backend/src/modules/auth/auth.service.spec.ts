import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model, Types } from 'mongoose';
import { UserDocument } from '../../database/schemas/user.schema';
import { CartDocument } from '../../database/schemas/cart.schema';
import { CustomerProfileDocument } from '../../database/schemas/customer-profile.schema';
import { ServiceProviderProfileDocument } from '../../database/schemas/service-provider-profile.schema';
import { TransactionService } from '../../database/transaction.service';
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

/**
 * Builds a hydrated-document-like stub: real-ish fields plus `_id` and a
 * `toObject()` that returns the plain shape (as `toUserRecord` expects).
 */
function makeUserDoc(overrides: Record<string, unknown> = {}) {
  const base = {
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
  const _id = new Types.ObjectId();
  return {
    ...base,
    _id,
    toObject: () => ({ ...base, _id }),
  };
}

/** A chainable query stub whose exec() resolves to `value`. */
function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'skip', 'limit', 'lean', 'populate']) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

describe('AuthService', () => {
  let userModel: DeepMockProxy<Model<UserDocument>>;
  let cartModel: DeepMockProxy<Model<CartDocument>>;
  let customerProfileModel: DeepMockProxy<Model<CustomerProfileDocument>>;
  let providerProfileModel: DeepMockProxy<Model<ServiceProviderProfileDocument>>;
  let password: DeepMockProxy<PasswordService>;
  let tokens: DeepMockProxy<TokenService>;
  let otp: DeepMockProxy<OtpService>;
  let mailQueue: DeepMockProxy<MailQueue>;
  let audit: DeepMockProxy<AuditService>;
  let tx: DeepMockProxy<TransactionService>;
  let service: AuthService;

  beforeEach(() => {
    userModel = mockDeep<Model<UserDocument>>();
    cartModel = mockDeep<Model<CartDocument>>();
    customerProfileModel = mockDeep<Model<CustomerProfileDocument>>();
    providerProfileModel = mockDeep<Model<ServiceProviderProfileDocument>>();
    password = mockDeep<PasswordService>();
    tokens = mockDeep<TokenService>();
    otp = mockDeep<OtpService>();
    mailQueue = mockDeep<MailQueue>();
    audit = mockDeep<AuditService>();
    tx = mockDeep<TransactionService>();
    tx.run.mockImplementation(async (work) => work({} as never));
    const config = { get: (k: string) => CONFIG[k] } as unknown as ConfigService;

    service = new AuthService(
      userModel,
      cartModel,
      customerProfileModel,
      providerProfileModel,
      password,
      tokens,
      otp,
      mailQueue,
      audit,
      config,
      tx,
    );
    tokens.issuePair.mockResolvedValue({
      accessToken: 'a',
      refreshToken: 'r',
      accessExpiresIn: 900,
      refreshExpiresIn: 604800,
    });
  });

  describe('register', () => {
    it('rejects a duplicate email with 409', async () => {
      userModel.findOne.mockReturnValue(queryChain(makeUserDoc()) as never);
      await expect(
        service.register({ name: 'Jane', email: 'jane@example.com', password: 'S3curePass!' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('creates a CUSTOMER, issues an OTP, and returns tokens without the password hash', async () => {
      userModel.findOne.mockReturnValue(queryChain(null) as never);
      password.hash.mockResolvedValue('hashed');
      userModel.create.mockResolvedValue([makeUserDoc()] as never);
      cartModel.create.mockResolvedValue([{}] as never);
      otp.issue.mockResolvedValue({ code: '123456', expiresAt: new Date() });

      const result = await service.register({
        name: 'Jane',
        email: 'jane@example.com',
        password: 'S3curePass!',
      });

      expect(otp.issue).toHaveBeenCalled();
      expect(mailQueue.enqueueOtp).toHaveBeenCalled();
      expect((result.user as Record<string, unknown>).passwordHash).toBeUndefined();
      expect(result.tokens.accessToken).toBe('a');
    });
  });

  describe('login lockout', () => {
    it('increments failedLoginCount on a wrong password', async () => {
      userModel.findOne.mockReturnValue(queryChain(makeUserDoc({ failedLoginCount: 1 })) as never);
      password.verify.mockResolvedValue(false);

      await expect(
        service.login({ email: 'jane@example.com', password: 'wrong' }, {}),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      const [, update] = userModel.updateOne.mock.calls[0] as unknown as [
        unknown,
        { $set: { failedLoginCount: number } },
      ];
      expect(update.$set.failedLoginCount).toBe(2);
    });

    it('applies a lock once the threshold is reached', async () => {
      userModel.findOne.mockReturnValue(queryChain(makeUserDoc({ failedLoginCount: 4 })) as never); // 5th attempt
      password.verify.mockResolvedValue(false);

      await expect(
        service.login({ email: 'jane@example.com', password: 'wrong' }, {}),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      const [, update] = userModel.updateOne.mock.calls[0] as unknown as [
        unknown,
        { $set: { lockedUntil: Date; failedLoginCount: number } },
      ];
      expect(update.$set.lockedUntil).toBeInstanceOf(Date);
      expect(update.$set.failedLoginCount).toBe(0);
    });

    it('rejects login while the account is locked (422), without checking the password', async () => {
      userModel.findOne.mockReturnValue(
        queryChain(makeUserDoc({ lockedUntil: new Date(Date.now() + 60_000) })) as never,
      );

      await expect(
        service.login({ email: 'jane@example.com', password: 'Correct1!' }, {}),
      ).rejects.toBeInstanceOf(BusinessRuleException);
      expect(password.verify).not.toHaveBeenCalled();
    });

    it('resets counters and issues tokens on success', async () => {
      userModel.findOne.mockReturnValue(queryChain(makeUserDoc({ failedLoginCount: 3 })) as never);
      password.verify.mockResolvedValue(true);
      userModel.findByIdAndUpdate.mockReturnValue(
        queryChain(makeUserDoc({ failedLoginCount: 0 })) as never,
      );

      const result = await service.login(
        { email: 'jane@example.com', password: 'Correct1!' },
        { ip: '1.2.3.4' },
      );

      const [, update] = userModel.findByIdAndUpdate.mock.calls[0] as unknown as [
        unknown,
        { $set: { failedLoginCount: number; lockedUntil: null } },
      ];
      expect(update.$set.failedLoginCount).toBe(0);
      expect(update.$set.lockedUntil).toBeNull();
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

import { ConflictException, NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model, Types } from 'mongoose';
import { ServiceProviderProfileDocument } from '../../database/schemas/service-provider-profile.schema';
import { ServiceDocument } from '../../database/schemas/service.schema';
import { UserDocument } from '../../database/schemas/user.schema';
import { UserRole } from '../../common/enums';
import { TransactionService } from '../../database/transaction.service';
import { ProvidersService } from './providers.service';

function profileDoc(overrides: Record<string, unknown> = {}) {
  const _id = new Types.ObjectId();
  const base = { userId: 'u1', businessName: 'Baobab', isVerified: false, ...overrides };
  return { _id, ...base, toObject: () => ({ _id, ...base }) };
}

function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'skip', 'limit', 'lean']) chain[m] = jest.fn().mockReturnValue(chain);
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

describe('ProvidersService', () => {
  let providerModel: DeepMockProxy<Model<ServiceProviderProfileDocument>>;
  let serviceModel: DeepMockProxy<Model<ServiceDocument>>;
  let userModel: DeepMockProxy<Model<UserDocument>>;
  let tx: DeepMockProxy<TransactionService>;
  let service: ProvidersService;

  beforeEach(() => {
    providerModel = mockDeep<Model<ServiceProviderProfileDocument>>();
    serviceModel = mockDeep<Model<ServiceDocument>>();
    userModel = mockDeep<Model<UserDocument>>();
    tx = mockDeep<TransactionService>();
    tx.run.mockImplementation(async (work) => work({} as never));
    service = new ProvidersService(providerModel, serviceModel, userModel, tx);
  });

  describe('onboard', () => {
    it('rejects a user who already has a provider profile (409)', async () => {
      providerModel.exists.mockResolvedValue({ _id: 'spp1' } as never);
      await expect(service.onboard('u1', { businessName: 'Biz' })).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('creates the profile and flips the user role in one transaction', async () => {
      providerModel.exists.mockResolvedValue(null);
      providerModel.create.mockResolvedValue([profileDoc()] as never);
      userModel.updateOne.mockResolvedValue({} as never);

      const result = await service.onboard('u1', { businessName: 'Baobab' });

      const createArg = (providerModel.create.mock.calls[0] as unknown[])[0] as Array<Record<string, unknown>>;
      expect(createArg[0]).toMatchObject({ userId: 'u1', businessName: 'Baobab' });
      const [, userUpdate] = userModel.updateOne.mock.calls[0] as unknown as [unknown, { $set: { role: string } }];
      expect(userUpdate.$set.role).toBe(UserRole.SERVICE_PROVIDER);
      expect(result.id).toBeDefined();
    });
  });

  describe('getMine', () => {
    it('throws NotFound when the caller has no profile', async () => {
      providerModel.findOne.mockReturnValue(queryChain(null) as never);
      await expect(service.getMine('u1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('verify', () => {
    it('sets isVerified + verifiedAt', async () => {
      providerModel.findByIdAndUpdate.mockReturnValue(
        queryChain(profileDoc({ isVerified: true, verifiedAt: new Date() })) as never,
      );

      const result = await service.verify('spp1');
      const [, update] = providerModel.findByIdAndUpdate.mock.calls[0] as unknown as [
        unknown,
        { $set: { isVerified: boolean; verifiedAt: Date } },
      ];
      expect(update.$set.isVerified).toBe(true);
      expect(update.$set.verifiedAt).toBeInstanceOf(Date);
      expect(result.isVerified).toBe(true);
    });

    it('throws NotFound for an unknown provider', async () => {
      providerModel.findByIdAndUpdate.mockReturnValue(queryChain(null) as never);
      await expect(service.verify('nope')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('list', () => {
    it('applies the isVerified filter', async () => {
      providerModel.find.mockReturnValue(queryChain([]) as never);
      providerModel.countDocuments.mockReturnValue(queryChain(0) as never);
      await service.list({ isVerified: true, page: 1, limit: 10 });
      const filter = (providerModel.find.mock.calls[0] as unknown[])[0];
      expect(filter).toMatchObject({ isVerified: true });
    });
  });

  describe('publicServices', () => {
    it('throws NotFound for an unknown provider', async () => {
      providerModel.exists.mockResolvedValue(null);
      await expect(service.publicServices('nope', {})).rejects.toBeInstanceOf(NotFoundException);
    });

    it('lists only ACTIVE, non-deleted services for the provider', async () => {
      providerModel.exists.mockResolvedValue({ _id: 'spp1' } as never);
      serviceModel.find.mockReturnValue(queryChain([]) as never);
      serviceModel.countDocuments.mockReturnValue(queryChain(0) as never);
      await service.publicServices('spp1', { page: 1, limit: 10 });
      const filter = (serviceModel.find.mock.calls[0] as unknown[])[0];
      expect(filter).toMatchObject({ providerId: 'spp1', status: 'ACTIVE', deletedAt: null });
    });
  });
});

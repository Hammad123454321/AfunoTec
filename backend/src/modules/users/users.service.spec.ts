import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model } from 'mongoose';
import { UserRole } from '../../common/enums';
import { UserDocument } from '../../database/schemas/user.schema';
import { TokenService } from '../auth/token.service';
import { UsersService } from './users.service';

/** Builds a chainable query stub whose terminal exec() resolves to `value`. */
function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'skip', 'limit', 'lean']) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

describe('UsersService', () => {
  let model: DeepMockProxy<Model<UserDocument>>;
  let tokens: DeepMockProxy<TokenService>;
  let service: UsersService;

  beforeEach(() => {
    model = mockDeep<Model<UserDocument>>();
    tokens = mockDeep<TokenService>();
    service = new UsersService(model, tokens);
  });

  describe('list', () => {
    it('applies role, isActive and search filters and excludes soft-deleted users', async () => {
      model.find.mockReturnValue(queryChain([]) as never);
      model.countDocuments.mockReturnValue(queryChain(0) as never);

      await service.list({
        role: UserRole.CUSTOMER,
        isActive: true,
        query: 'jane',
        page: 1,
        limit: 10,
      });

      const filter = (model.find.mock.calls[0] as unknown[])[0] as Record<string, unknown> & {
        $or?: unknown[];
      };
      expect(filter).toMatchObject({
        deletedAt: null,
        role: UserRole.CUSTOMER,
        isActive: true,
      });
      expect(filter.$or).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: expect.any(RegExp) }),
          expect.objectContaining({ email: expect.any(RegExp) }),
        ]),
      );
    });

    it('defaults to createdAt desc when sort is absent', async () => {
      const chain = queryChain([]);
      model.find.mockReturnValue(chain as never);
      model.countDocuments.mockReturnValue(queryChain(0) as never);

      await service.list({ page: 1, limit: 10 });
      expect(chain.sort).toHaveBeenCalledWith({ createdAt: 'desc' });
    });
  });

  describe('getById', () => {
    it('throws NotFound for a missing/deleted user', async () => {
      model.findOne.mockReturnValue(queryChain(null) as never);
      await expect(service.getById('x')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('setStatus', () => {
    it('revokes sessions when deactivating', async () => {
      model.findOne.mockReturnValue(queryChain({ _id: 'u1' }) as never);
      model.findByIdAndUpdate.mockReturnValue(queryChain({ _id: 'u1', isActive: false }) as never);
      await service.setStatus('u1', false);
      expect(tokens.revokeAllForUser).toHaveBeenCalledWith('u1');
    });

    it('does NOT revoke sessions when activating', async () => {
      model.findOne.mockReturnValue(queryChain({ _id: 'u1' }) as never);
      model.findByIdAndUpdate.mockReturnValue(queryChain({ _id: 'u1', isActive: true }) as never);
      await service.setStatus('u1', true);
      expect(tokens.revokeAllForUser).not.toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('sets deletedAt + isActive=false and revokes sessions', async () => {
      model.findOne.mockReturnValue(queryChain({ _id: 'u1' }) as never);
      model.updateOne.mockResolvedValue({} as never);
      await service.softDelete('u1');

      const [, update] = model.updateOne.mock.calls[0] as unknown as [
        unknown,
        { $set: { deletedAt: Date; isActive: boolean } },
      ];
      expect(update.$set.deletedAt).toBeInstanceOf(Date);
      expect(update.$set.isActive).toBe(false);
      expect(tokens.revokeAllForUser).toHaveBeenCalledWith('u1');
    });

    it('throws NotFound when the user does not exist', async () => {
      model.findOne.mockReturnValue(queryChain(null) as never);
      await expect(service.softDelete('nope')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('assignRole', () => {
    it('updates the role', async () => {
      model.findOne.mockReturnValue(queryChain({ _id: 'u1' }) as never);
      model.findByIdAndUpdate.mockReturnValue(
        queryChain({ _id: 'u1', role: UserRole.SERVICE_PROVIDER }) as never,
      );
      const result = await service.assignRole('u1', UserRole.SERVICE_PROVIDER);
      expect(result.role).toBe(UserRole.SERVICE_PROVIDER);
    });
  });
});

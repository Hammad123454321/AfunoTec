import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model, Types } from 'mongoose';
import { WishlistItemDocument } from '../../database/schemas/wishlist-item.schema';
import { ServiceDocument } from '../../database/schemas/service.schema';
import { WishlistService } from './wishlist.service';

/** Chainable query stub resolving to `value` at exec(). */
function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'skip', 'limit', 'lean', 'populate']) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

describe('WishlistService', () => {
  let wishlistModel: DeepMockProxy<Model<WishlistItemDocument>>;
  let serviceModel: DeepMockProxy<Model<ServiceDocument>>;
  let service: WishlistService;

  beforeEach(() => {
    wishlistModel = mockDeep<Model<WishlistItemDocument>>();
    serviceModel = mockDeep<Model<ServiceDocument>>();
    service = new WishlistService(wishlistModel, serviceModel);
  });

  describe('add', () => {
    it('throws NotFound for a missing service', async () => {
      serviceModel.exists.mockResolvedValue(null);
      await expect(service.add('u1', 'x')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('adds a new item', async () => {
      serviceModel.exists.mockResolvedValue({ _id: new Types.ObjectId() } as never);
      wishlistModel.create.mockResolvedValue({} as never);
      await expect(service.add('u1', 'svc1')).resolves.toEqual({ added: true });
    });

    it('is idempotent: a duplicate (11000) resolves to added:false', async () => {
      serviceModel.exists.mockResolvedValue({ _id: new Types.ObjectId() } as never);
      const dupErr = Object.assign(new Error('dup'), { code: 11000 });
      wishlistModel.create.mockRejectedValue(dupErr as never);
      await expect(service.add('u1', 'svc1')).resolves.toEqual({ added: false });
    });
  });

  describe('remove', () => {
    it('reports removed:true when a row was deleted', async () => {
      wishlistModel.deleteOne.mockResolvedValue({ deletedCount: 1 } as never);
      await expect(service.remove('u1', 'svc1')).resolves.toEqual({ removed: true });
    });

    it('reports removed:false when nothing matched', async () => {
      wishlistModel.deleteOne.mockResolvedValue({ deletedCount: 0 } as never);
      await expect(service.remove('u1', 'svc1')).resolves.toEqual({ removed: false });
    });
  });

  describe('list', () => {
    it('returns the wishlisted services with a light projection', async () => {
      const svcId = new Types.ObjectId();
      const itemId = new Types.ObjectId();
      const createdAt = new Date();
      wishlistModel.find.mockReturnValue(
        queryChain([{ _id: itemId, serviceId: svcId, createdAt }]) as never,
      );
      serviceModel.find.mockReturnValue(
        queryChain([
          {
            _id: svcId,
            slug: 'beach-villa',
            name: 'Beach Villa',
            title: 'A Beach Villa',
            basePrice: { toString: () => '100' },
            currency: 'MGA',
            rating: { toString: () => '4.5' },
            status: 'PUBLISHED',
            images: [
              { url: 'secondary.jpg', isPrimary: false },
              { url: 'primary.jpg', isPrimary: true },
            ],
          },
        ]) as never,
      );

      const res = (await service.list('u1')) as Array<Record<string, any>>;
      expect(res).toHaveLength(1);
      expect(res[0].id).toBe(itemId.toString());
      expect(res[0].service.id).toBe(svcId.toString());
      expect(res[0].service.basePrice).toBe('100');
      expect(res[0].service.images).toEqual([{ url: 'primary.jpg' }]);
    });

    it('drops items whose service is soft-deleted/missing', async () => {
      const svcId = new Types.ObjectId();
      wishlistModel.find.mockReturnValue(
        queryChain([{ _id: new Types.ObjectId(), serviceId: svcId, createdAt: new Date() }]) as never,
      );
      // service filtered out by deletedAt:null → not returned
      serviceModel.find.mockReturnValue(queryChain([]) as never);
      await expect(service.list('u1')).resolves.toEqual([]);
    });

    it('returns an empty list with no items (no service lookup)', async () => {
      wishlistModel.find.mockReturnValue(queryChain([]) as never);
      await expect(service.list('u1')).resolves.toEqual([]);
      expect(serviceModel.find).not.toHaveBeenCalled();
    });
  });
});

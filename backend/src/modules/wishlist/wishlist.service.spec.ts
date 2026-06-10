import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../common/prisma/prisma.service';
import { WishlistService } from './wishlist.service';

describe('WishlistService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let service: WishlistService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    service = new WishlistService(prisma);
  });

  describe('add', () => {
    it('throws NotFound for a missing service', async () => {
      prisma.service.findFirst.mockResolvedValue(null);
      await expect(service.add('u1', 'x')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('adds a new item', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 'svc1' } as any);
      prisma.wishlistItem.create.mockResolvedValue({} as any);
      await expect(service.add('u1', 'svc1')).resolves.toEqual({ added: true });
    });

    it('is idempotent: a duplicate (P2002) resolves to added:false', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 'svc1' } as any);
      prisma.wishlistItem.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('dup', { code: 'P2002', clientVersion: 'x' }),
      );
      await expect(service.add('u1', 'svc1')).resolves.toEqual({ added: false });
    });
  });

  describe('remove', () => {
    it('reports removed:true when a row was deleted', async () => {
      prisma.wishlistItem.deleteMany.mockResolvedValue({ count: 1 } as any);
      await expect(service.remove('u1', 'svc1')).resolves.toEqual({ removed: true });
    });

    it('reports removed:false when nothing matched', async () => {
      prisma.wishlistItem.deleteMany.mockResolvedValue({ count: 0 } as any);
      await expect(service.remove('u1', 'svc1')).resolves.toEqual({ removed: false });
    });
  });
});

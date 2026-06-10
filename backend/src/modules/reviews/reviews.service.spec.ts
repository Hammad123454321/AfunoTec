import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { ReviewsService } from './reviews.service';

const customer = { id: 'u1', email: 'c@x.com', role: 'CUSTOMER' };
const admin = { id: 'admin1', email: 'a@x.com', role: 'ADMIN' };

describe('ReviewsService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let service: ReviewsService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    service = new ReviewsService(prisma, {} as ConfigService);
    delete process.env.REVIEWS_REQUIRE_BOOKING; // default: required
  });

  /** Wires $transaction to run the callback against the same prisma mock. */
  function passthroughTx() {
    prisma.$transaction.mockImplementation(async (cb: any) => cb(prisma));
  }

  describe('create', () => {
    it('throws NotFound for a missing service', async () => {
      prisma.service.findFirst.mockResolvedValue(null);
      await expect(service.create(customer as any, 'svc1', { rating: 5 })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('rejects a second review for the same service (422)', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 'svc1' } as any);
      prisma.review.findFirst.mockResolvedValue({ id: 'r0' } as any);
      await expect(service.create(customer as any, 'svc1', { rating: 5 })).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });

    it('requires a COMPLETED booking by default (422 without one)', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 'svc1' } as any);
      prisma.review.findFirst.mockResolvedValue(null);
      prisma.booking.findFirst.mockResolvedValue(null); // no completed booking
      await expect(service.create(customer as any, 'svc1', { rating: 5 })).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });

    it('creates the review and recomputes aggregates when a booking exists', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 'svc1' } as any);
      prisma.review.findFirst.mockResolvedValue(null);
      prisma.booking.findFirst.mockResolvedValue({ id: 'bk1' } as any);
      passthroughTx();
      prisma.review.create.mockResolvedValue({ id: 'r1', serviceId: 'svc1', rating: 4 } as any);
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4 }, _count: 1 } as any);

      const review = await service.create(customer as any, 'svc1', { rating: 4 });

      expect(review.id).toBe('r1');
      expect(prisma.review.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ bookingId: 'bk1', rating: 4 }) }),
      );
      const updateArg = (prisma.service.update as jest.Mock).mock.calls[0][0];
      expect(updateArg.data.reviewCount).toBe(1);
      expect(updateArg.data.rating.toString()).toBe('4');
    });

    it('skips the booking requirement when REVIEWS_REQUIRE_BOOKING=false', async () => {
      process.env.REVIEWS_REQUIRE_BOOKING = 'false';
      prisma.service.findFirst.mockResolvedValue({ id: 'svc1' } as any);
      prisma.review.findFirst.mockResolvedValue(null);
      passthroughTx();
      prisma.review.create.mockResolvedValue({ id: 'r1', serviceId: 'svc1', rating: 5 } as any);
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 5 }, _count: 1 } as any);

      await service.create(customer as any, 'svc1', { rating: 5 });
      expect(prisma.booking.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('rejects editing someone else’s review (403)', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 'r1', authorId: 'other', createdAt: new Date() } as any);
      await expect(service.update(customer as any, 'r1', { rating: 3 })).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('rejects editing after the edit window (422)', async () => {
      const old = new Date(Date.now() - 1000 * 60 * 60 * 72); // 72h ago
      prisma.review.findUnique.mockResolvedValue({ id: 'r1', authorId: 'u1', createdAt: old, serviceId: 'svc1' } as any);
      await expect(service.update(customer as any, 'r1', { rating: 3 })).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });

    it('updates within the window and recomputes when rating changes', async () => {
      prisma.review.findUnique.mockResolvedValue({
        id: 'r1', authorId: 'u1', createdAt: new Date(), serviceId: 'svc1',
      } as any);
      passthroughTx();
      prisma.review.update.mockResolvedValue({ id: 'r1', rating: 5 } as any);
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 5 }, _count: 1 } as any);

      await service.update(customer as any, 'r1', { rating: 5 });
      expect(prisma.service.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('lets an admin delete any review and recomputes', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 'r1', authorId: 'someoneElse', serviceId: 'svc1' } as any);
      passthroughTx();
      prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null }, _count: 0 } as any);

      await service.remove(admin as any, 'r1');
      expect(prisma.review.delete).toHaveBeenCalledWith({ where: { id: 'r1' } });
      const updateArg = (prisma.service.update as jest.Mock).mock.calls[0][0];
      expect(updateArg.data.reviewCount).toBe(0);
      expect(updateArg.data.rating).toBeNull();
    });

    it('forbids a non-owner non-admin (403)', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 'r1', authorId: 'other', serviceId: 'svc1' } as any);
      await expect(service.remove(customer as any, 'r1')).rejects.toBeInstanceOf(ForbiddenException);
    });
  });
});

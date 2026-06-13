import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model, Types } from 'mongoose';
import { ReviewDocument } from '../../database/schemas/review.schema';
import { ServiceDocument } from '../../database/schemas/service.schema';
import { BookingDocument } from '../../database/schemas/booking.schema';
import { TransactionService } from '../../database/transaction.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { ReviewsService } from './reviews.service';

const customer = { id: 'u1', email: 'c@x.com', role: 'CUSTOMER' };
const admin = { id: 'admin1', email: 'a@x.com', role: 'ADMIN' };

/** A valid 24-char ObjectId hex string (recompute casts serviceId to ObjectId). */
const SVC = new Types.ObjectId().toString();

/** Chainable query stub where every chain method returns `this` and `exec` resolves `value`. */
function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'skip', 'limit', 'lean', 'populate']) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

/** Aggregate stub: `.session()` returns `this`, awaiting resolves to the rows. */
function aggregateChain(rows: unknown[]) {
  const chain: Record<string, unknown> = {};
  chain.session = jest.fn().mockReturnValue(chain);
  (chain as { then: unknown }).then = (resolve: (v: unknown) => unknown) => resolve(rows);
  return chain;
}

/** Mocked Review doc with `_id`, ObjectId fk fields and `toObject`. */
function reviewDoc(overrides: Record<string, unknown> = {}) {
  const _id = new Types.ObjectId();
  const base = {
    _id,
    serviceId: 'svc1',
    authorId: 'u1',
    rating: 4,
    createdAt: new Date(),
    ...overrides,
  };
  return {
    ...base,
    authorId: { toString: () => String(base.authorId) },
    serviceId: { toString: () => String(base.serviceId) },
    toObject: () => ({ ...base }),
  };
}

describe('ReviewsService', () => {
  let reviewModel: DeepMockProxy<Model<ReviewDocument>>;
  let serviceModel: DeepMockProxy<Model<ServiceDocument>>;
  let bookingModel: DeepMockProxy<Model<BookingDocument>>;
  let tx: DeepMockProxy<TransactionService>;
  let service: ReviewsService;

  beforeEach(() => {
    reviewModel = mockDeep<Model<ReviewDocument>>();
    serviceModel = mockDeep<Model<ServiceDocument>>();
    bookingModel = mockDeep<Model<BookingDocument>>();
    tx = mockDeep<TransactionService>();
    tx.run.mockImplementation(async (work) => work({} as never));
    service = new ReviewsService(
      reviewModel,
      serviceModel,
      bookingModel,
      {} as ConfigService,
      tx,
    );
    delete process.env.REVIEWS_REQUIRE_BOOKING; // default: required
  });

  describe('create', () => {
    it('throws NotFound for a missing service', async () => {
      serviceModel.findOne.mockReturnValue(queryChain(null) as never);
      await expect(service.create(customer as any, 'svc1', { rating: 5 })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('rejects a second review for the same service (422)', async () => {
      serviceModel.findOne.mockReturnValue(queryChain({ _id: SVC }) as never);
      reviewModel.findOne.mockReturnValue(queryChain({ _id: 'r0' }) as never);
      await expect(service.create(customer as any, 'svc1', { rating: 5 })).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });

    it('requires a COMPLETED booking by default (422 without one)', async () => {
      serviceModel.findOne.mockReturnValue(queryChain({ _id: SVC }) as never);
      reviewModel.findOne.mockReturnValue(queryChain(null) as never);
      bookingModel.findOne.mockReturnValue(queryChain(null) as never); // no completed booking
      await expect(service.create(customer as any, 'svc1', { rating: 5 })).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });

    it('creates the review and recomputes aggregates when a booking exists', async () => {
      const bkId = new Types.ObjectId();
      serviceModel.findOne.mockReturnValue(queryChain({ _id: SVC }) as never);
      reviewModel.findOne.mockReturnValue(queryChain(null) as never);
      bookingModel.findOne.mockReturnValue(
        queryChain({ _id: { toString: () => bkId.toString() } }) as never,
      );
      reviewModel.create.mockResolvedValue([
        reviewDoc({ serviceId: 'svc1', rating: 4 }),
      ] as never);
      reviewModel.aggregate.mockReturnValue(aggregateChain([{ avg: 4, count: 1 }]) as never);
      serviceModel.updateOne.mockResolvedValue({} as never);

      const review = await service.create(customer as any, SVC, { rating: 4 });

      expect(review.id).toBeDefined();
      const createArg = (reviewModel.create.mock.calls[0] as unknown[])[0] as Array<
        Record<string, unknown>
      >;
      expect(createArg[0]).toMatchObject({ bookingId: bkId.toString(), rating: 4 });
      const [, update] = serviceModel.updateOne.mock.calls[0] as unknown as [
        unknown,
        { $set: { reviewCount: number; rating: { toString(): string } } },
      ];
      expect(update.$set.reviewCount).toBe(1);
      expect(update.$set.rating.toString()).toBe('4');
    });

    it('skips the booking requirement when REVIEWS_REQUIRE_BOOKING=false', async () => {
      process.env.REVIEWS_REQUIRE_BOOKING = 'false';
      serviceModel.findOne.mockReturnValue(queryChain({ _id: SVC }) as never);
      reviewModel.findOne.mockReturnValue(queryChain(null) as never);
      reviewModel.create.mockResolvedValue([
        reviewDoc({ serviceId: 'svc1', rating: 5 }),
      ] as never);
      reviewModel.aggregate.mockReturnValue(aggregateChain([{ avg: 5, count: 1 }]) as never);
      serviceModel.updateOne.mockResolvedValue({} as never);

      await service.create(customer as any, SVC, { rating: 5 });
      expect(bookingModel.findOne).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('rejects editing someone else’s review (403)', async () => {
      reviewModel.findById.mockReturnValue(
        queryChain(reviewDoc({ authorId: 'other', createdAt: new Date() })) as never,
      );
      await expect(service.update(customer as any, 'r1', { rating: 3 })).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('rejects editing after the edit window (422)', async () => {
      const old = new Date(Date.now() - 1000 * 60 * 60 * 72); // 72h ago
      reviewModel.findById.mockReturnValue(
        queryChain(reviewDoc({ authorId: 'u1', createdAt: old, serviceId: 'svc1' })) as never,
      );
      await expect(service.update(customer as any, 'r1', { rating: 3 })).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });

    it('updates within the window and recomputes when rating changes', async () => {
      reviewModel.findById.mockReturnValue(
        queryChain(
          reviewDoc({ authorId: 'u1', createdAt: new Date(), serviceId: SVC }),
        ) as never,
      );
      reviewModel.findByIdAndUpdate.mockReturnValue(
        queryChain(reviewDoc({ rating: 5 })) as never,
      );
      reviewModel.aggregate.mockReturnValue(aggregateChain([{ avg: 5, count: 1 }]) as never);
      serviceModel.updateOne.mockResolvedValue({} as never);

      await service.update(customer as any, 'r1', { rating: 5 });
      expect(serviceModel.updateOne).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('lets an admin delete any review and recomputes', async () => {
      reviewModel.findById.mockReturnValue(
        queryChain(reviewDoc({ authorId: 'someoneElse', serviceId: SVC })) as never,
      );
      reviewModel.deleteOne.mockResolvedValue({} as never);
      reviewModel.aggregate.mockReturnValue(aggregateChain([]) as never); // no reviews left
      serviceModel.updateOne.mockResolvedValue({} as never);

      await service.remove(admin as any, 'r1');
      const [delFilter] = reviewModel.deleteOne.mock.calls[0] as unknown as [{ _id: string }];
      expect(delFilter).toMatchObject({ _id: 'r1' });
      const [, update] = serviceModel.updateOne.mock.calls[0] as unknown as [
        unknown,
        { $set: { reviewCount: number; rating: unknown } },
      ];
      expect(update.$set.reviewCount).toBe(0);
      expect(update.$set.rating).toBeNull();
    });

    it('forbids a non-owner non-admin (403)', async () => {
      reviewModel.findById.mockReturnValue(
        queryChain(reviewDoc({ authorId: 'other', serviceId: 'svc1' })) as never,
      );
      await expect(service.remove(customer as any, 'r1')).rejects.toBeInstanceOf(ForbiddenException);
    });
  });
});

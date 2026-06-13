import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model, Types } from 'mongoose';
import { Cache } from 'cache-manager';
import { ServiceDocument } from '../../database/schemas/service.schema';
import { ServiceRoomDocument } from '../../database/schemas/service-room.schema';
import { CategoryDocument } from '../../database/schemas/category.schema';
import { TagDocument } from '../../database/schemas/tag.schema';
import { ServiceProviderProfileDocument } from '../../database/schemas/service-provider-profile.schema';
import { ServiceAvailabilityDocument } from '../../database/schemas/service-availability.schema';
import { ServiceStatus } from '../../common/enums';
import { TransactionService } from '../../database/transaction.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { ServicesService } from './services.service';
import { ServiceQueryBuilder } from './service-query.builder';
import { ServicePricingService } from './service-pricing.service';

const provider = { id: 'u1', email: 'p@x.com', role: 'SERVICE_PROVIDER' };

/** Chainable query stub: every chain method returns `this`; `exec` resolves `value`. */
function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'skip', 'limit', 'lean', 'populate']) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

function serviceDoc(overrides: Record<string, unknown> = {}) {
  const _id = new Types.ObjectId();
  const base = {
    _id,
    slug: 's1',
    status: ServiceStatus.DRAFT,
    basePrice: Types.Decimal128.fromString('200000'),
    ...overrides,
  };
  return { ...base, toObject: () => ({ ...base }) };
}

describe('ServicesService', () => {
  let serviceModel: DeepMockProxy<Model<ServiceDocument>>;
  let roomModel: DeepMockProxy<Model<ServiceRoomDocument>>;
  let categoryModel: DeepMockProxy<Model<CategoryDocument>>;
  let tagModel: DeepMockProxy<Model<TagDocument>>;
  let providerModel: DeepMockProxy<Model<ServiceProviderProfileDocument>>;
  let availabilityModel: DeepMockProxy<Model<ServiceAvailabilityDocument>>;
  let tx: DeepMockProxy<TransactionService>;
  let cache: DeepMockProxy<Cache>;
  let queryBuilder: ServiceQueryBuilder;
  let service: ServicesService;

  beforeEach(() => {
    serviceModel = mockDeep<Model<ServiceDocument>>();
    roomModel = mockDeep<Model<ServiceRoomDocument>>();
    categoryModel = mockDeep<Model<CategoryDocument>>();
    tagModel = mockDeep<Model<TagDocument>>();
    providerModel = mockDeep<Model<ServiceProviderProfileDocument>>();
    availabilityModel = mockDeep<Model<ServiceAvailabilityDocument>>();
    tx = mockDeep<TransactionService>();
    cache = mockDeep<Cache>();
    tx.run.mockImplementation(async (work) => work({} as never));
    queryBuilder = new ServiceQueryBuilder(categoryModel, tagModel, availabilityModel);
    service = new ServicesService(
      serviceModel,
      roomModel,
      categoryModel,
      tagModel,
      providerModel,
      queryBuilder,
      new ServicePricingService(),
      tx,
      cache,
    );
  });

  describe('ServiceQueryBuilder (via list filters)', () => {
    it('builds filter with ACTIVE/deletedAt and category/price/tags/date constraints', async () => {
      const catId = new Types.ObjectId();
      const tagId = new Types.ObjectId();
      const svcId = new Types.ObjectId();
      categoryModel.findOne.mockReturnValue(queryChain({ _id: catId }) as never);
      tagModel.find.mockReturnValue(queryChain([{ _id: tagId }]) as never);
      availabilityModel.find.mockReturnValue(queryChain([{ serviceId: svcId }]) as never);

      const where = await queryBuilder.buildWhere({
        categorySlug: 'stays',
        minPrice: 100,
        maxPrice: 500,
        tags: ['family'],
        checkIn: '2026-07-01',
        checkOut: '2026-07-05',
      });

      expect(where).toMatchObject({ status: 'ACTIVE', deletedAt: null });
      expect((where.categoryId as Types.ObjectId).toString()).toBe(catId.toString());
      expect(where.basePrice).toBeDefined();
      expect(where.tags).toBeDefined();
      expect(where._id).toBeDefined();
    });
  });

  describe('create', () => {
    it('requires a provider profile (403 otherwise)', async () => {
      providerModel.findOne.mockReturnValue(queryChain(null) as never);
      await expect(
        service.create(provider as never, {
          name: 'X',
          title: 'X',
          categoryId: 'c1',
          basePrice: 1,
        } as never),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('rejects an unknown category (422)', async () => {
      providerModel.findOne.mockReturnValue(
        queryChain({ _id: new Types.ObjectId() }) as never,
      );
      categoryModel.findById.mockReturnValue(queryChain(null) as never);
      await expect(
        service.create(provider as never, {
          name: 'X',
          title: 'X',
          categoryId: new Types.ObjectId().toString(),
          basePrice: 1,
        } as never),
      ).rejects.toBeInstanceOf(BusinessRuleException);
    });
  });

  describe('setStatus', () => {
    it('rejects an illegal transition (422)', async () => {
      serviceModel.findOne.mockReturnValue(queryChain({ status: 'DRAFT' }) as never);
      await expect(
        service.setStatus('s1', ServiceStatus.INACTIVE),
      ).rejects.toBeInstanceOf(BusinessRuleException);
    });

    it('allows DRAFT -> ACTIVE', async () => {
      serviceModel.findOne.mockReturnValue(queryChain({ status: 'DRAFT' }) as never);
      serviceModel.findByIdAndUpdate.mockReturnValue(
        queryChain(serviceDoc({ status: 'ACTIVE' })) as never,
      );
      const r = await service.setStatus('s1', ServiceStatus.ACTIVE);
      expect(r.status).toBe('ACTIVE');
    });

    it('throws NotFound for a missing service', async () => {
      serviceModel.findOne.mockReturnValue(queryChain(null) as never);
      await expect(service.setStatus('nope', ServiceStatus.ACTIVE)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('trackView', () => {
    it('increments once then debounces the second call', async () => {
      serviceModel.findOne.mockReturnValue(queryChain({ _id: new Types.ObjectId() }) as never);
      serviceModel.updateOne.mockReturnValue(queryChain({}) as never);
      cache.get.mockResolvedValueOnce(undefined).mockResolvedValueOnce(1);

      await service.trackView('s1', '1.2.3.4'); // first → increments
      await service.trackView('s1', '1.2.3.4'); // second → debounced

      expect(serviceModel.updateOne).toHaveBeenCalledTimes(1);
      const [, update] = serviceModel.updateOne.mock.calls[0] as unknown as [
        unknown,
        { $inc: { viewCount: number } },
      ];
      expect(update.$inc.viewCount).toBe(1);
    });
  });

  describe('remove', () => {
    it('soft-deletes (sets deletedAt + ARCHIVED)', async () => {
      serviceModel.exists.mockResolvedValue({ _id: new Types.ObjectId() } as never);
      serviceModel.updateOne.mockReturnValue(queryChain({}) as never);
      await service.remove('s1');
      const [, update] = serviceModel.updateOne.mock.calls[0] as unknown as [
        unknown,
        { $set: { deletedAt: Date; status: string } },
      ];
      expect(update.$set.deletedAt).toBeInstanceOf(Date);
      expect(update.$set.status).toBe('ARCHIVED');
    });
  });

  describe('list', () => {
    it('serializes effectivePrice as a string', async () => {
      serviceModel.find.mockReturnValue(
        queryChain([
          { _id: new Types.ObjectId(), basePrice: Types.Decimal128.fromString('200000'), discounts: [] },
        ]) as never,
      );
      serviceModel.countDocuments.mockReturnValue(queryChain(1) as never);
      const res = await service.list({});
      expect(typeof (res.data[0] as { effectivePrice: unknown }).effectivePrice).toBe('string');
      expect((res.data[0] as { effectivePrice: string }).effectivePrice).toBe('200000');
    });
  });
});

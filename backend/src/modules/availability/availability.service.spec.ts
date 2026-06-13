import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model, Types } from 'mongoose';
import { ServiceAvailabilityDocument } from '../../database/schemas/service-availability.schema';
import { ServiceDocument } from '../../database/schemas/service.schema';
import { TransactionService } from '../../database/transaction.service';
import { toDecimal128 } from '../../common/utils/money.util';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { AvailabilityService } from './availability.service';

function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'skip', 'limit', 'lean', 'populate']) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

describe('AvailabilityService', () => {
  let availabilityModel: DeepMockProxy<Model<ServiceAvailabilityDocument>>;
  let serviceModel: DeepMockProxy<Model<ServiceDocument>>;
  let tx: DeepMockProxy<TransactionService>;
  let service: AvailabilityService;

  beforeEach(() => {
    availabilityModel = mockDeep<Model<ServiceAvailabilityDocument>>();
    serviceModel = mockDeep<Model<ServiceDocument>>();
    tx = mockDeep<TransactionService>();
    tx.run.mockImplementation(async (work) => work({} as never));
    service = new AvailabilityService(availabilityModel, serviceModel, tx);
  });

  describe('range', () => {
    it('synthesizes defaults for days without a row and uses overrides where present', async () => {
      serviceModel.findOne.mockReturnValue(
        queryChain({ _id: new Types.ObjectId(), basePrice: toDecimal128(200000) }) as never,
      );
      availabilityModel.find.mockReturnValue(
        queryChain([
          {
            serviceId: new Types.ObjectId(),
            date: new Date('2026-07-02T00:00:00.000Z'),
            qtyTotal: 5,
            qtyReserved: 2,
            priceOverride: toDecimal128(150000),
            isClosed: false,
          },
        ]) as never,
      );

      const days = await service.range('s1', '2026-07-01', '2026-07-03');
      expect(days).toHaveLength(3);

      const d1 = days.find((d) => d.date === '2026-07-01')!;
      expect(d1.synthesized).toBe(true);
      expect(d1.price).toBe('200000.00'); // base price
      expect(d1.qtyAvailable).toBe(1);

      const d2 = days.find((d) => d.date === '2026-07-02')!;
      expect(d2.synthesized).toBe(false);
      expect(d2.price).toBe('150000.00'); // override
      expect(d2.qtyAvailable).toBe(3); // 5 - 2
    });

    it('throws NotFound for a missing service', async () => {
      serviceModel.findOne.mockReturnValue(queryChain(null) as never);
      await expect(service.range('nope', '2026-07-01', '2026-07-03')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('rejects an inverted range', async () => {
      serviceModel.findOne.mockReturnValue(
        queryChain({ _id: new Types.ObjectId(), basePrice: toDecimal128(1) }) as never,
      );
      availabilityModel.find.mockReturnValue(queryChain([]) as never);
      await expect(service.range('s1', '2026-07-05', '2026-07-01')).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });
  });

  describe('setRange', () => {
    it('upserts one row per day in the inclusive range', async () => {
      serviceModel.exists.mockResolvedValue({ _id: new Types.ObjectId() } as never);
      availabilityModel.updateOne.mockResolvedValue({} as never);

      const res = await service.setRange('507f1f77bcf86cd799439011', {
        from: '2026-07-01',
        to: '2026-07-05',
        qtyTotal: 5,
      });
      expect(res.updated).toBe(5);
      // one upsert per day inside the transaction
      expect(availabilityModel.updateOne).toHaveBeenCalledTimes(5);
    });

    it('rejects a range over the max length', async () => {
      serviceModel.exists.mockResolvedValue({ _id: new Types.ObjectId() } as never);
      await expect(
        service.setRange('507f1f77bcf86cd799439011', { from: '2026-01-01', to: '2028-01-01' }),
      ).rejects.toBeInstanceOf(BusinessRuleException);
    });
  });

  describe('overrideDay', () => {
    it('upserts a single day and returns the computed view', async () => {
      serviceModel.exists.mockResolvedValue({ _id: new Types.ObjectId() } as never);
      availabilityModel.findOneAndUpdate.mockReturnValue(
        queryChain({
          serviceId: new Types.ObjectId(),
          date: new Date('2026-07-02T00:00:00.000Z'),
          qtyTotal: 3,
          qtyReserved: 0,
          priceOverride: null,
          isClosed: true,
        }) as never,
      );
      serviceModel.findById.mockReturnValue(
        queryChain({ _id: new Types.ObjectId(), basePrice: toDecimal128(200000) }) as never,
      );

      const day = await service.overrideDay('507f1f77bcf86cd799439011', '2026-07-02', {
        isClosed: true,
      });
      expect(day.isClosed).toBe(true);
      expect(day.price).toBe('200000.00');
    });
  });
});

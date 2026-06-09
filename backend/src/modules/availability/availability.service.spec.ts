import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { AvailabilityService } from './availability.service';

describe('AvailabilityService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let service: AvailabilityService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    service = new AvailabilityService(prisma);
  });

  describe('range', () => {
    it('synthesizes defaults for days without a row and uses overrides where present', async () => {
      prisma.service.findFirst.mockResolvedValue({
        id: 's1',
        basePrice: new Prisma.Decimal(200000),
      } as any);
      prisma.serviceAvailability.findMany.mockResolvedValue([
        {
          serviceId: 's1',
          date: new Date('2026-07-02T00:00:00.000Z'),
          qtyTotal: 5,
          qtyReserved: 2,
          priceOverride: new Prisma.Decimal(150000),
          isClosed: false,
        },
      ] as any);

      const days = await service.range('s1', '2026-07-01', '2026-07-03');
      expect(days).toHaveLength(3);

      const d1 = days.find((d) => d.date === '2026-07-01')!;
      expect(d1.synthesized).toBe(true);
      expect(d1.price).toBe('200000'); // base price
      expect(d1.qtyAvailable).toBe(1);

      const d2 = days.find((d) => d.date === '2026-07-02')!;
      expect(d2.synthesized).toBe(false);
      expect(d2.price).toBe('150000'); // override
      expect(d2.qtyAvailable).toBe(3); // 5 - 2
    });

    it('throws NotFound for a missing service', async () => {
      prisma.service.findFirst.mockResolvedValue(null);
      await expect(service.range('nope', '2026-07-01', '2026-07-03')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('rejects an inverted range', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 's1', basePrice: new Prisma.Decimal(1) } as any);
      prisma.serviceAvailability.findMany.mockResolvedValue([] as any);
      await expect(service.range('s1', '2026-07-05', '2026-07-01')).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });
  });

  describe('setRange', () => {
    it('upserts one row per day in the inclusive range', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 's1' } as any);
      prisma.$transaction.mockResolvedValue([] as any);
      const res = await service.setRange('s1', {
        from: '2026-07-01',
        to: '2026-07-05',
        qtyTotal: 5,
      });
      expect(res.updated).toBe(5);
      // one upsert call object per day passed to $transaction
      const txArg = (prisma.$transaction as jest.Mock).mock.calls[0][0];
      expect(txArg).toHaveLength(5);
    });

    it('rejects a range over the max length', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 's1' } as any);
      await expect(
        service.setRange('s1', { from: '2026-01-01', to: '2028-01-01' }),
      ).rejects.toBeInstanceOf(BusinessRuleException);
    });
  });

  describe('overrideDay', () => {
    it('upserts a single day and returns the computed view', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 's1' } as any);
      prisma.serviceAvailability.upsert.mockResolvedValue({
        serviceId: 's1',
        date: new Date('2026-07-02T00:00:00.000Z'),
        qtyTotal: 3,
        qtyReserved: 0,
        priceOverride: null,
        isClosed: true,
      } as any);
      prisma.service.findUniqueOrThrow.mockResolvedValue({
        basePrice: new Prisma.Decimal(200000),
      } as any);

      const day = await service.overrideDay('s1', '2026-07-02', { isClosed: true });
      expect(day.isClosed).toBe(true);
      expect(day.price).toBe('200000');
    });
  });
});

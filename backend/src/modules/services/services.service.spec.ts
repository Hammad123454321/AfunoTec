import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { ServicesService } from './services.service';
import { ServiceQueryBuilder } from './service-query.builder';
import { ServicePricingService } from './service-pricing.service';

const provider = { id: 'u1', email: 'p@x.com', role: 'SERVICE_PROVIDER' };

describe('ServicesService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let cache: DeepMockProxy<Cache>;
  let service: ServicesService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    cache = mockDeep<Cache>();
    service = new ServicesService(prisma, new ServiceQueryBuilder(), new ServicePricingService(), cache);
  });

  describe('ServiceQueryBuilder (via list filters)', () => {
    it('builds where with ACTIVE/deletedAt and category/price/tags/date filters', () => {
      const where = new ServiceQueryBuilder().buildWhere({
        categorySlug: 'stays',
        minPrice: 100,
        maxPrice: 500,
        tags: ['family'],
        checkIn: '2026-07-01',
        checkOut: '2026-07-05',
      });
      expect(where).toMatchObject({ status: 'ACTIVE', deletedAt: null });
      expect(where.category).toEqual({ slug: 'stays' });
      expect(where.basePrice).toEqual({ gte: 100, lte: 500 });
      expect(where.tags).toEqual({ some: { tag: { slug: { in: ['family'] } } } });
      expect(where.availabilities).toBeDefined();
    });
  });

  describe('create', () => {
    it('requires a provider profile (403 otherwise)', async () => {
      prisma.serviceProviderProfile.findUnique.mockResolvedValue(null);
      await expect(
        service.create(provider as any, { name: 'X', title: 'X', categoryId: 'c1', basePrice: 1 } as any),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('rejects an unknown category (422)', async () => {
      prisma.serviceProviderProfile.findUnique.mockResolvedValue({ id: 'spp1' } as any);
      prisma.category.findUnique.mockResolvedValue(null);
      await expect(
        service.create(provider as any, { name: 'X', title: 'X', categoryId: 'bad', basePrice: 1 } as any),
      ).rejects.toBeInstanceOf(BusinessRuleException);
    });
  });

  describe('setStatus', () => {
    it('rejects an illegal transition (422)', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 's1', status: 'DRAFT' } as any);
      await expect(service.setStatus('s1', 'INACTIVE' as any)).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });

    it('allows DRAFT -> ACTIVE', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 's1', status: 'DRAFT' } as any);
      prisma.service.update.mockResolvedValue({ id: 's1', status: 'ACTIVE' } as any);
      const r = await service.setStatus('s1', 'ACTIVE' as any);
      expect(r.status).toBe('ACTIVE');
    });

    it('throws NotFound for a missing service', async () => {
      prisma.service.findFirst.mockResolvedValue(null);
      await expect(service.setStatus('nope', 'ACTIVE' as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('trackView', () => {
    it('increments once then debounces the second call', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 's1' } as any);
      cache.get.mockResolvedValueOnce(undefined).mockResolvedValueOnce(1);

      await service.trackView('s1', '1.2.3.4'); // first → increments
      await service.trackView('s1', '1.2.3.4'); // second → debounced

      expect(prisma.service.update).toHaveBeenCalledTimes(1);
      expect(prisma.service.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { viewCount: { increment: 1 } } }),
      );
    });
  });

  describe('remove', () => {
    it('soft-deletes (sets deletedAt + ARCHIVED)', async () => {
      prisma.service.findFirst.mockResolvedValue({ id: 's1' } as any);
      prisma.service.update.mockResolvedValue({} as any);
      await service.remove('s1');
      const arg = (prisma.service.update as jest.Mock).mock.calls[0][0];
      expect(arg.data.deletedAt).toBeInstanceOf(Date);
      expect(arg.data.status).toBe('ARCHIVED');
    });
  });

  describe('list', () => {
    it('serializes effectivePrice as a string', async () => {
      prisma.$transaction.mockResolvedValue([
        [{ id: 's1', basePrice: new Prisma.Decimal(200000), discounts: [] }],
        1,
      ] as any);
      const res = await service.list({});
      expect(typeof (res.data[0] as any).effectivePrice).toBe('string');
      expect((res.data[0] as any).effectivePrice).toBe('200000');
    });
  });
});

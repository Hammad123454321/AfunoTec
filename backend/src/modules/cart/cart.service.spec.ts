import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { ServicePricingService } from '../services/service-pricing.service';
import { CartService } from './cart.service';

describe('CartService', () => {
  let prisma: DeepMockProxy<PrismaService>;
  let service: CartService;

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    service = new CartService(prisma, new ServicePricingService());
  });

  function activeService(extra: Partial<any> = {}) {
    return {
      id: 'svc1',
      status: 'ACTIVE',
      basePrice: new Prisma.Decimal(100000),
      currency: 'MGA',
      discounts: [],
      addOns: [{ id: 'a1', title: 'Breakfast', price: new Prisma.Decimal(20000) }],
      ...extra,
    };
  }

  describe('addItem', () => {
    it('rejects an inactive service', async () => {
      prisma.cart.upsert.mockResolvedValue({ id: 'cart1' } as any);
      prisma.service.findFirst.mockResolvedValue(activeService({ status: 'DRAFT' }) as any);
      await expect(service.addItem('u1', { serviceId: 'svc1' })).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });

    it('rejects a missing service', async () => {
      prisma.cart.upsert.mockResolvedValue({ id: 'cart1' } as any);
      prisma.service.findFirst.mockResolvedValue(null);
      await expect(service.addItem('u1', { serviceId: 'x' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('rejects an add-on that does not belong to the service', async () => {
      prisma.cart.upsert.mockResolvedValue({ id: 'cart1' } as any);
      prisma.service.findFirst.mockResolvedValue(activeService() as any);
      await expect(
        service.addItem('u1', { serviceId: 'svc1', addOnIds: ['bogus'] }),
      ).rejects.toBeInstanceOf(BusinessRuleException);
    });

    it('prices the line at the effective unit price and persists it', async () => {
      prisma.cart.upsert
        .mockResolvedValueOnce({ id: 'cart1' } as any) // ensureCart
        .mockResolvedValueOnce({ id: 'cart1', userId: 'u1', currency: 'MGA', items: [] } as any); // getCart
      prisma.service.findFirst.mockResolvedValue(activeService() as any);
      prisma.cartItem.create.mockResolvedValue({} as any);

      await service.addItem('u1', { serviceId: 'svc1', units: 2, addOnIds: ['a1'] });

      const createArg = (prisma.cartItem.create as jest.Mock).mock.calls[0][0];
      expect(createArg.data.unitPrice.toString()).toBe('100000');
      expect(createArg.data.addOnsJson).toEqual([
        { id: 'a1', title: 'Breakfast', price: '20000' },
      ]);
    });
  });

  describe('withTotals (via getCart)', () => {
    it('computes line totals including add-ons and a cart subtotal', async () => {
      prisma.cart.upsert.mockResolvedValue({
        id: 'cart1',
        userId: 'u1',
        currency: 'MGA',
        items: [
          {
            id: 'i1',
            unitPrice: new Prisma.Decimal(100000),
            units: 3,
            addOnsJson: [{ id: 'a1', title: 'Breakfast', price: '20000' }],
            service: { name: 'X', slug: 'x' },
          },
        ],
      } as any);

      const cart = (await service.getCart('u1')) as any;
      expect(cart.items[0].lineTotal).toBe('360000'); // (100000+20000)*3
      expect(cart.subtotal).toBe('360000');
      expect(cart.itemCount).toBe(1);
    });
  });
});

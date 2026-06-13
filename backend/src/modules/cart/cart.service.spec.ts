import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Model, Types } from 'mongoose';
import { CartDocument } from '../../database/schemas/cart.schema';
import { ServiceDocument } from '../../database/schemas/service.schema';
import { ServiceStatus } from '../../common/enums';
import { toDecimal, toDecimal128 } from '../../common/utils/money.util';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { ServicePricingService } from '../services/service-pricing.service';
import { CartService } from './cart.service';

function queryChain(value: unknown) {
  const chain: Record<string, jest.Mock> = {};
  for (const m of ['select', 'sort', 'lean']) chain[m] = jest.fn().mockReturnValue(chain);
  chain.exec = jest.fn().mockResolvedValue(value);
  return chain;
}

/** Builds a hydrated-cart stand-in: a DocumentArray-like `items` plus a save() spy. */
function cartDoc(items: Record<string, unknown>[] = []) {
  const _id = new Types.ObjectId();
  const arr = items.slice() as unknown as Record<string, unknown>[] & {
    pull: (q: { _id: string }) => void;
    push: (...docs: Record<string, unknown>[]) => number;
  };
  const nativePush = Array.prototype.push.bind(arr);
  // Mirror Mongoose DocumentArray: assign an `_id` to subdocs on push.
  arr.push = (...docs: Record<string, unknown>[]) => {
    for (const d of docs) if (!d._id) d._id = new Types.ObjectId();
    return nativePush(...docs);
  };
  arr.pull = (q: { _id: string }) => {
    const idx = arr.findIndex((i) => (i._id as Types.ObjectId).toString() === q._id);
    if (idx >= 0) arr.splice(idx, 1);
  };
  return {
    _id,
    userId: new Types.ObjectId(),
    currency: 'MGA',
    items: arr,
    save: jest.fn().mockResolvedValue(undefined),
  };
}

function activeService(extra: Record<string, unknown> = {}) {
  return {
    _id: new Types.ObjectId(),
    status: ServiceStatus.ACTIVE,
    basePrice: toDecimal128(100000),
    currency: 'MGA',
    discounts: [],
    addOns: [
      { _id: new Types.ObjectId('a00000000000000000000001'), title: 'Breakfast', price: toDecimal128(20000), isActive: true },
    ],
    ...extra,
  };
}

describe('CartService', () => {
  let cartModel: DeepMockProxy<Model<CartDocument>>;
  let serviceModel: DeepMockProxy<Model<ServiceDocument>>;
  let service: CartService;

  beforeEach(() => {
    cartModel = mockDeep<Model<CartDocument>>();
    serviceModel = mockDeep<Model<ServiceDocument>>();
    service = new CartService(cartModel, serviceModel, new ServicePricingService());
  });

  describe('addItem', () => {
    it('rejects an inactive service', async () => {
      cartModel.findOne.mockReturnValue(queryChain(cartDoc()) as never);
      serviceModel.findOne.mockReturnValue(
        queryChain(activeService({ status: ServiceStatus.DRAFT })) as never,
      );
      await expect(service.addItem('u1', { serviceId: 'svc1' })).rejects.toBeInstanceOf(
        BusinessRuleException,
      );
    });

    it('rejects a missing service', async () => {
      cartModel.findOne.mockReturnValue(queryChain(cartDoc()) as never);
      serviceModel.findOne.mockReturnValue(queryChain(null) as never);
      await expect(service.addItem('u1', { serviceId: 'x' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('rejects an add-on that does not belong to the service', async () => {
      cartModel.findOne.mockReturnValue(queryChain(cartDoc()) as never);
      serviceModel.findOne.mockReturnValue(queryChain(activeService()) as never);
      await expect(
        service.addItem('u1', { serviceId: 'svc1', addOnIds: ['bogus'] }),
      ).rejects.toBeInstanceOf(BusinessRuleException);
    });

    it('prices the line at the effective unit price and persists it', async () => {
      const cart = cartDoc();
      const svc = activeService();
      const addOnId = (svc.addOns[0]._id as Types.ObjectId).toString();
      // ensureCart (add) -> ensureCart (getCart) both return the same hydrated doc
      cartModel.findOne.mockReturnValue(queryChain(cart) as never);
      serviceModel.findOne.mockReturnValue(queryChain(svc) as never);
      // withTotals service name/slug lookup
      serviceModel.find.mockReturnValue(
        queryChain([{ _id: svc._id, name: 'X', slug: 'x' }]) as never,
      );

      await service.addItem('u1', { serviceId: 'svc1', units: 2, addOnIds: [addOnId] });

      expect(cart.save).toHaveBeenCalled();
      const persisted = cart.items[0] as { unitPrice: Types.Decimal128; addOns: unknown };
      expect(toDecimal(persisted.unitPrice).toString()).toBe('100000');
      expect(persisted.addOns).toEqual([{ id: addOnId, title: 'Breakfast', price: '20000' }]);
    });
  });

  describe('withTotals (via getCart)', () => {
    it('computes line totals including add-ons and a cart subtotal', async () => {
      const itemId = new Types.ObjectId();
      const svcId = new Types.ObjectId();
      const cart = cartDoc([
        {
          _id: itemId,
          serviceId: svcId,
          unitPrice: toDecimal128(100000),
          units: 3,
          adults: 1,
          currency: 'MGA',
          addOns: [{ id: 'a1', title: 'Breakfast', price: '20000' }],
        },
      ]);
      cartModel.findOne.mockReturnValue(queryChain(cart) as never);
      serviceModel.find.mockReturnValue(
        queryChain([{ _id: svcId, name: 'X', slug: 'x' }]) as never,
      );

      const result = (await service.getCart('u1')) as {
        items: Array<{ lineTotal: string }>;
        subtotal: string;
        itemCount: number;
      };
      expect(result.items[0].lineTotal).toBe('360000'); // (100000+20000)*3
      expect(result.subtotal).toBe('360000');
      expect(result.itemCount).toBe(1);
    });
  });
});

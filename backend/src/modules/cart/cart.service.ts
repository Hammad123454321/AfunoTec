import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { ServicePricingService } from '../services/service-pricing.service';
import { add, mul, round2, sum, toDecimal } from '../../common/utils/money.util';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

interface ResolvedAddOn {
  id: string;
  title: string;
  price: string;
}

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricing: ServicePricingService,
  ) {}

  /** Returns the caller's cart (creating it on first access) with recomputed totals. */
  async getCart(userId: string): Promise<unknown> {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { items: { include: { service: { select: { name: true, slug: true } } }, orderBy: { createdAt: 'asc' } } },
    });
    return this.withTotals(cart);
  }

  /** Adds a line for an ACTIVE service, pricing it at add time. */
  async addItem(userId: string, dto: AddCartItemDto): Promise<unknown> {
    const cart = await this.ensureCart(userId);

    const service = await this.prisma.service.findFirst({
      where: { id: dto.serviceId, deletedAt: null },
      include: { discounts: { where: { isActive: true } }, addOns: { where: { isActive: true } } },
    });
    if (!service) throw new NotFoundException('Service not found');
    if (service.status !== 'ACTIVE') {
      throw new BusinessRuleException('Service is not available for booking');
    }

    const addOns = this.resolveAddOns(service.addOns, dto.addOnIds);
    const unitPrice = this.pricing.compute({
      basePrice: service.basePrice,
      discounts: service.discounts,
    }).effectivePrice;

    await this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        serviceId: service.id,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        units: dto.units ?? 1,
        adults: dto.adults ?? 1,
        childrenAges: (dto.childrenAges ?? undefined) as Prisma.InputJsonValue | undefined,
        addOnsJson: (addOns.length ? addOns : undefined) as Prisma.InputJsonValue | undefined,
        unitPrice,
        currency: service.currency,
      },
    });
    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<unknown> {
    const item = await this.findOwnedItem(userId, itemId);

    let addOnsJson: Prisma.InputJsonValue | undefined;
    if (dto.addOnIds) {
      const service = await this.prisma.service.findUniqueOrThrow({
        where: { id: item.serviceId },
        include: { addOns: { where: { isActive: true } } },
      });
      addOnsJson = this.resolveAddOns(service.addOns, dto.addOnIds) as unknown as Prisma.InputJsonValue;
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: {
        ...(dto.startDate !== undefined && { startDate: dto.startDate ? new Date(dto.startDate) : null }),
        ...(dto.endDate !== undefined && { endDate: dto.endDate ? new Date(dto.endDate) : null }),
        ...(dto.units !== undefined && { units: dto.units }),
        ...(dto.adults !== undefined && { adults: dto.adults }),
        ...(dto.childrenAges !== undefined && {
          childrenAges: dto.childrenAges as Prisma.InputJsonValue,
        }),
        ...(addOnsJson !== undefined && { addOnsJson }),
      },
    });
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<unknown> {
    await this.findOwnedItem(userId, itemId);
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  }

  async clear(userId: string): Promise<unknown> {
    const cart = await this.ensureCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getCart(userId);
  }

  // -- Helpers ----------------------------------------------------------------

  private resolveAddOns(
    available: { id: string; title: string; price: Prisma.Decimal }[],
    requested?: string[],
  ): ResolvedAddOn[] {
    if (!requested?.length) return [];
    const byId = new Map(available.map((a) => [a.id, a]));
    const resolved: ResolvedAddOn[] = [];
    for (const id of requested) {
      const found = byId.get(id);
      if (!found) throw new BusinessRuleException(`Add-on ${id} is not available for this service`);
      resolved.push({ id: found.id, title: found.title, price: found.price.toString() });
    }
    return resolved;
  }

  /** Computes per-line and cart totals (unitPrice * units + add-ons * units). */
  private withTotals(cart: {
    id: string;
    userId: string;
    currency: string;
    items: Array<{
      id: string;
      unitPrice: Prisma.Decimal;
      units: number;
      addOnsJson: Prisma.JsonValue;
      [k: string]: unknown;
    }>;
  }): unknown {
    const items = cart.items.map((item) => {
      const addOns = Array.isArray(item.addOnsJson) ? (item.addOnsJson as unknown as ResolvedAddOn[]) : [];
      const addOnPerUnit = sum(addOns.map((a) => a.price));
      const lineTotal = round2(mul(add(item.unitPrice, addOnPerUnit), item.units));
      return { ...item, unitPrice: item.unitPrice.toString(), lineTotal: lineTotal.toString() };
    });
    const subtotal = round2(
      items.reduce((acc, i) => add(acc, i.lineTotal), toDecimal(0)),
    );
    return { id: cart.id, currency: cart.currency, items, subtotal: subtotal.toString(), itemCount: items.length };
  }

  private async ensureCart(userId: string): Promise<{ id: string }> {
    return this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      select: { id: true },
    });
  }

  private async findOwnedItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    return item;
  }
}

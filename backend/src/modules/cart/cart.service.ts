import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument, CartItem } from '../../database/schemas/cart.schema';
import {
  Service,
  ServiceAddOn,
  ServiceDocument,
} from '../../database/schemas/service.schema';
import { ServiceStatus } from '../../common/enums';
import { BusinessRuleException } from '../../common/errors/business-rule.exception';
import { ServicePricingService } from '../services/service-pricing.service';
import {
  add,
  mul,
  round2,
  sum,
  toDecimal,
  toDecimal128,
} from '../../common/utils/money.util';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

interface ResolvedAddOn {
  id: string;
  title: string;
  price: string;
}

/** An embedded cart item as a hydrated Mongoose subdocument (has its own `_id`). */
type CartItemSubdoc = CartItem & { _id: Types.ObjectId };

/** The embedded `items` array on a hydrated cart, typed as a Mongoose DocumentArray. */
function itemsOf(cart: CartDocument): Types.DocumentArray<CartItemSubdoc> {
  return cart.items as unknown as Types.DocumentArray<CartItemSubdoc>;
}

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    private readonly pricing: ServicePricingService,
  ) {}

  /** Returns the caller's cart (creating it on first access) with recomputed totals. */
  async getCart(userId: string): Promise<unknown> {
    const cart = await this.ensureCart(userId);
    return this.withTotals(cart);
  }

  /** Adds a line for an ACTIVE service, pricing it at add time. */
  async addItem(userId: string, dto: AddCartItemDto): Promise<unknown> {
    const cart = await this.ensureCart(userId);

    const service = await this.serviceModel
      .findOne({ _id: dto.serviceId, deletedAt: null })
      .exec();
    if (!service) throw new NotFoundException('Service not found');
    if (service.status !== ServiceStatus.ACTIVE) {
      throw new BusinessRuleException('Service is not available for booking');
    }

    const activeAddOns = service.addOns.filter((a) => a.isActive);
    const activeDiscounts = service.discounts.filter((d) => d.isActive);
    const addOns = this.resolveAddOns(activeAddOns, dto.addOnIds);
    const unitPrice = this.pricing.compute({
      basePrice: toDecimal(service.basePrice),
      discounts: activeDiscounts as unknown as Parameters<
        ServicePricingService['compute']
      >[0]['discounts'],
    }).effectivePrice;

    const item: CartItem = {
      serviceId: service._id,
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      units: dto.units ?? 1,
      adults: dto.adults ?? 1,
      childrenAges: dto.childrenAges ?? null,
      addOns: addOns.length ? addOns : undefined,
      unitPrice: toDecimal128(unitPrice),
      currency: service.currency,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    itemsOf(cart).push(item as CartItemSubdoc);
    await cart.save();
    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<unknown> {
    const cart = await this.ensureCart(userId);
    const item = this.findOwnedItem(cart, itemId);

    if (dto.addOnIds) {
      const service = await this.serviceModel.findById(item.serviceId).exec();
      if (!service) throw new NotFoundException('Service not found');
      const activeAddOns = service.addOns.filter((a) => a.isActive);
      item.addOns = this.resolveAddOns(activeAddOns, dto.addOnIds);
    }
    if (dto.startDate !== undefined) {
      item.startDate = dto.startDate ? new Date(dto.startDate) : null;
    }
    if (dto.endDate !== undefined) {
      item.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }
    if (dto.units !== undefined) item.units = dto.units;
    if (dto.adults !== undefined) item.adults = dto.adults;
    if (dto.childrenAges !== undefined) item.childrenAges = dto.childrenAges;
    item.updatedAt = new Date();

    await cart.save();
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<unknown> {
    const cart = await this.ensureCart(userId);
    this.findOwnedItem(cart, itemId);
    itemsOf(cart).pull({ _id: itemId });
    await cart.save();
    return this.getCart(userId);
  }

  async clear(userId: string): Promise<unknown> {
    const cart = await this.ensureCart(userId);
    cart.items.splice(0, cart.items.length);
    await cart.save();
    return this.getCart(userId);
  }

  // -- Helpers ----------------------------------------------------------------

  private resolveAddOns(
    available: (ServiceAddOn & { _id?: Types.ObjectId })[],
    requested?: string[],
  ): ResolvedAddOn[] {
    if (!requested?.length) return [];
    const byId = new Map(available.map((a) => [a._id?.toString(), a]));
    const resolved: ResolvedAddOn[] = [];
    for (const id of requested) {
      const found = byId.get(id);
      if (!found) throw new BusinessRuleException(`Add-on ${id} is not available for this service`);
      resolved.push({
        id: found._id!.toString(),
        title: found.title,
        price: toDecimal(found.price).toString(),
      });
    }
    return resolved;
  }

  /** Computes per-line and cart totals (unitPrice * units + add-ons * units). */
  private async withTotals(cart: CartDocument): Promise<unknown> {
    const cartItems = itemsOf(cart);
    const serviceIds = cartItems.map((i) => i.serviceId);
    const services = serviceIds.length
      ? await this.serviceModel
          .find({ _id: { $in: serviceIds } })
          .select({ name: 1, slug: 1 })
          .lean()
          .exec()
      : [];
    const byServiceId = new Map(services.map((s) => [s._id.toString(), s]));

    const items = cartItems.map((item) => {
      const addOns = Array.isArray(item.addOns) ? (item.addOns as ResolvedAddOn[]) : [];
      const addOnPerUnit = sum(addOns.map((a) => a.price));
      const lineTotal = round2(mul(add(toDecimal(item.unitPrice), addOnPerUnit), item.units));
      const svc = byServiceId.get(item.serviceId.toString());
      return {
        id: item._id.toString(),
        serviceId: item.serviceId.toString(),
        service: svc ? { name: svc.name, slug: svc.slug } : null,
        startDate: item.startDate ?? null,
        endDate: item.endDate ?? null,
        units: item.units,
        adults: item.adults,
        childrenAges: item.childrenAges ?? null,
        addOns,
        currency: item.currency,
        unitPrice: toDecimal(item.unitPrice).toString(),
        lineTotal: lineTotal.toString(),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
    const subtotal = round2(items.reduce((acc, i) => add(acc, i.lineTotal), toDecimal(0)));
    return {
      id: cart._id.toString(),
      currency: cart.currency,
      items,
      subtotal: subtotal.toString(),
      itemCount: items.length,
    };
  }

  /** Loads the caller's cart, creating it on first access. */
  private async ensureCart(userId: string): Promise<CartDocument> {
    const existing = await this.cartModel.findOne({ userId }).exec();
    if (existing) return existing;
    return this.cartModel.create({ userId });
  }

  private findOwnedItem(cart: CartDocument, itemId: string): CartItemSubdoc {
    const item = itemsOf(cart).find((i) => i._id.toString() === itemId);
    if (!item) throw new NotFoundException('Cart item not found');
    return item;
  }
}

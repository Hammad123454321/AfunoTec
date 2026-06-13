import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WishlistItem, WishlistItemDocument } from '../../database/schemas/wishlist-item.schema';
import { Service, ServiceDocument } from '../../database/schemas/service.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(WishlistItem.name)
    private readonly wishlistModel: Model<WishlistItemDocument>,
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
  ) {}

  /** Lists the caller's wishlisted services (with a light service projection). */
  async list(userId: string): Promise<unknown[]> {
    const items = (await this.wishlistModel
      .find({ userId })
      .sort({ createdAt: 'desc' })
      .lean()
      .exec()) as unknown as Array<{
      _id: { toString(): string };
      serviceId: { toString(): string };
      createdAt: Date;
    }>;
    if (items.length === 0) return [];

    const serviceIds = items.map((i) => i.serviceId);
    const services = await this.serviceModel
      .find({ _id: { $in: serviceIds }, deletedAt: null })
      .select('slug name title basePrice currency rating status images')
      .lean()
      .exec();

    const byId = new Map(services.map((s) => [s._id.toString(), s]));

    return items
      .map((i) => {
        const svc = byId.get(i.serviceId.toString());
        if (!svc) return null; // service soft-deleted or removed → drop from list
        const primary = (svc.images ?? []).find((img) => img.isPrimary);
        return {
          id: i._id.toString(),
          createdAt: i.createdAt,
          service: {
            id: svc._id.toString(),
            slug: svc.slug,
            name: svc.name,
            title: svc.title,
            basePrice: svc.basePrice.toString(),
            currency: svc.currency,
            rating: svc.rating ?? null,
            status: svc.status,
            images: primary ? [{ url: primary.url }] : [],
          },
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }

  /** Adds a service to the wishlist. Idempotent: a duplicate add is a no-op. */
  async add(userId: string, serviceId: string): Promise<{ added: boolean }> {
    const service = await this.serviceModel
      .exists({ _id: serviceId, deletedAt: null })
      .then(Boolean);
    if (!service) throw new NotFoundException('Service not found');

    try {
      await this.wishlistModel.create({ userId, serviceId });
      return { added: true };
    } catch (err) {
      // Unique (userId, serviceId) violation → already wishlisted; treat as success.
      if (err instanceof Error && (err as { code?: number }).code === 11000) {
        return { added: false };
      }
      throw err;
    }
  }

  /** Removes a service from the wishlist (idempotent). */
  async remove(userId: string, serviceId: string): Promise<{ removed: boolean }> {
    const result = await this.wishlistModel.deleteOne({ userId, serviceId });
    return { removed: result.deletedCount > 0 };
  }
}

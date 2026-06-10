import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  /** Lists the caller's wishlisted services (with a light service projection). */
  async list(userId: string): Promise<unknown[]> {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId, service: { deletedAt: null } },
      orderBy: { createdAt: 'desc' },
      include: {
        service: {
          select: {
            id: true,
            slug: true,
            name: true,
            title: true,
            basePrice: true,
            currency: true,
            rating: true,
            status: true,
            images: { where: { isPrimary: true }, take: 1, select: { url: true } },
          },
        },
      },
    });
    return items.map((i) => ({
      id: i.id,
      createdAt: i.createdAt,
      service: { ...i.service, basePrice: i.service.basePrice.toString() },
    }));
  }

  /** Adds a service to the wishlist. Idempotent: a duplicate add is a no-op. */
  async add(userId: string, serviceId: string): Promise<{ added: boolean }> {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, deletedAt: null },
      select: { id: true },
    });
    if (!service) throw new NotFoundException('Service not found');

    try {
      await this.prisma.wishlistItem.create({ data: { userId, serviceId } });
      return { added: true };
    } catch (err) {
      // Unique (userId, serviceId) violation → already wishlisted; treat as success.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return { added: false };
      }
      throw err;
    }
  }

  /** Removes a service from the wishlist (idempotent). */
  async remove(userId: string, serviceId: string): Promise<{ removed: boolean }> {
    const result = await this.prisma.wishlistItem.deleteMany({ where: { userId, serviceId } });
    return { removed: result.count > 0 };
  }
}

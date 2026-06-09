import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../decorators/current-user.decorator';
import {
  OWNS_RESOURCE_KEY,
  OwnsResourceOptions,
} from '../decorators/owns-resource.decorator';

/** Roles that bypass ownership checks entirely. */
const PRIVILEGED_ROLES = new Set(['ADMIN', 'MANAGER']);

/**
 * Enforces that the authenticated user owns the resource referenced by a route
 * param, for routes annotated with `@OwnsResource(...)`. Runs after the global
 * JwtAuthGuard so `req.user` is populated. ADMIN/MANAGER bypass.
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.getAllAndOverride<OwnsResourceOptions | undefined>(
      OWNS_RESOURCE_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!options) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as AuthUser | undefined;
    if (!user) throw new ForbiddenException('Authentication required');
    if (PRIVILEGED_ROLES.has(user.role)) return true;

    const resourceId = req.params?.[options.param ?? 'id'];
    if (!resourceId) throw new ForbiddenException('Missing resource identifier');

    const ownerId = await this.resolveOwnerId(options, resourceId);
    if (ownerId === null) throw new NotFoundException('Resource not found');
    if (ownerId !== user.id) {
      throw new ForbiddenException('You do not have access to this resource');
    }
    return true;
  }

  /** Returns the owning user id for the resource, or null if it doesn't exist. */
  private async resolveOwnerId(
    options: OwnsResourceOptions,
    resourceId: string,
  ): Promise<string | null> {
    switch (options.model) {
      case 'service': {
        const service = await this.prisma.service.findUnique({
          where: { id: resourceId },
          select: { provider: { select: { userId: true } } },
        });
        return service?.provider?.userId ?? null;
      }
      case 'review': {
        const review = await this.prisma.review.findUnique({
          where: { id: resourceId },
          select: { authorId: true },
        });
        return review?.authorId ?? null;
      }
      case 'booking': {
        const booking = await this.prisma.booking.findUnique({
          where: { id: resourceId },
          select: { customerId: true },
        });
        return booking?.customerId ?? null;
      }
      case 'cartItem': {
        const item = await this.prisma.cartItem.findUnique({
          where: { id: resourceId },
          select: { cart: { select: { userId: true } } },
        });
        return item?.cart?.userId ?? null;
      }
      default:
        return null;
    }
  }
}

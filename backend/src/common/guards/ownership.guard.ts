import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from '../../database/schemas/service.schema';
import {
  ServiceProviderProfile,
  ServiceProviderProfileDocument,
} from '../../database/schemas/service-provider-profile.schema';
import { Review, ReviewDocument } from '../../database/schemas/review.schema';
import { Booking, BookingDocument } from '../../database/schemas/booking.schema';
import { Cart, CartDocument } from '../../database/schemas/cart.schema';
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
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(ServiceProviderProfile.name)
    private readonly providerModel: Model<ServiceProviderProfileDocument>,
    @InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
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
        // Service → ServiceProviderProfile → userId (two-hop ownership).
        const service = await this.serviceModel
          .findById(resourceId)
          .select({ providerId: 1 })
          .lean()
          .exec();
        if (!service) return null;
        const provider = await this.providerModel
          .findById(service.providerId)
          .select({ userId: 1 })
          .lean()
          .exec();
        return provider?.userId?.toString() ?? null;
      }
      case 'review': {
        const review = await this.reviewModel
          .findById(resourceId)
          .select({ authorId: 1 })
          .lean()
          .exec();
        return review?.authorId?.toString() ?? null;
      }
      case 'booking': {
        const booking = await this.bookingModel
          .findById(resourceId)
          .select({ customerId: 1 })
          .lean()
          .exec();
        return booking?.customerId?.toString() ?? null;
      }
      case 'cartItem': {
        // CartItem is an embedded subdoc; find the owning cart by items._id.
        const cart = await this.cartModel
          .findOne({ 'items._id': resourceId })
          .select({ userId: 1 })
          .lean()
          .exec();
        return cart?.userId?.toString() ?? null;
      }
      default:
        return null;
    }
  }
}

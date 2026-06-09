import { SetMetadata } from '@nestjs/common';

export const OWNS_RESOURCE_KEY = 'ownsResource';

/** Prisma models the OwnershipGuard knows how to resolve ownership for. */
export type OwnableModel = 'service' | 'review' | 'booking' | 'cartItem';

export interface OwnsResourceOptions {
  /** Which Prisma model the route param points at. */
  model: OwnableModel;
  /** Route param holding the resource id. Defaults to `id`. */
  param?: string;
  /**
   * When true, ownership is resolved through the service provider profile
   * (resource.provider.userId === user.id) rather than a direct userId field.
   */
  providerScoped?: boolean;
}

/**
 * Marks a route as requiring the caller to own the referenced resource.
 * ADMIN and MANAGER always pass. Enforced by `OwnershipGuard`.
 */
export const OwnsResource = (options: OwnsResourceOptions): MethodDecorator =>
  SetMetadata(OWNS_RESOURCE_KEY, { param: 'id', ...options });

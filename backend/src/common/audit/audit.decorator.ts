import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';

export interface AuditOptions {
  /** Action verb recorded, e.g. CREATE | UPDATE | DELETE | VERIFY. */
  action: string;
  /** Entity name recorded, e.g. "Category", "User", "Service". */
  entity: string;
  /** Route param holding the entity id (used when the response has no id). Defaults to `id`. */
  idParam?: string;
}

/**
 * Marks a mutation route for automatic audit logging by `AuditInterceptor`
 * after a successful response. Apply to admin/provider mutations.
 */
export const Audit = (options: AuditOptions): MethodDecorator =>
  SetMetadata(AUDIT_KEY, options);

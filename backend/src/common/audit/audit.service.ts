import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../../database/schemas/audit-log.schema';

export interface AuditEntry {
  actorId?: string | null;
  action: string; // CREATE | UPDATE | DELETE | LOGIN | VERIFY | ...
  entity: string; // e.g. "Service", "Booking", "User"
  entityId?: string | null;
  diff?: unknown;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * Append-only audit trail. Writes are fire-and-forget: a logging failure must
 * never break the mutation that triggered it.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLogDocument>,
  ) {}

  /** Records an audit entry; never throws. */
  async record(entry: AuditEntry): Promise<void> {
    try {
      await this.auditLogModel.create({
        actorId: entry.actorId ?? null,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        diff: entry.diff ?? undefined,
        ip: entry.ip ?? null,
        userAgent: entry.userAgent ?? null,
      });
    } catch (err) {
      this.logger.warn(
        `Failed to write audit log for ${entry.action} ${entry.entity}: ${
          err instanceof Error ? err.message : 'unknown error'
        }`,
      );
    }
  }
}

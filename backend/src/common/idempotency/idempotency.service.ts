import { ConflictException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface StoredResponse {
  statusCode: number;
  body: unknown;
}

export interface BeginResult {
  /** When set, the request is a replay and this stored response must be returned. */
  replay?: StoredResponse;
  /** Opaque id of the in-progress record to complete once the handler finishes. */
  recordId?: string;
}

/**
 * Durable idempotency store backed by the `IdempotencyKey` table. Guarantees
 * that a (key, user, path) tuple executes its side effects at most once.
 */
@Injectable()
export class IdempotencyService {
  constructor(private readonly prisma: PrismaService) {}

  /** Stable hash of the request body so replays with a different payload are detected. */
  hashRequest(body: unknown): string {
    const normalized = JSON.stringify(body ?? null);
    return createHash('sha256').update(normalized).digest('hex');
  }

  /**
   * Reserves the key for this request. Returns a stored response when this is a
   * completed replay; throws 409 when the same key is reused with a different
   * body or while an earlier identical request is still in flight.
   */
  async begin(params: {
    key: string;
    userId: string | null;
    method: string;
    path: string;
    requestHash: string;
  }): Promise<BeginResult> {
    const { key, userId, method, path, requestHash } = params;

    try {
      const created = await this.prisma.idempotencyKey.create({
        data: { key, userId, method, path, requestHash, lockedAt: new Date() },
      });
      return { recordId: created.id };
    } catch (err) {
      // Unique violation → a record for this (key,user,path) already exists.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        // userId may be null, so use findFirst (the compound-unique findUnique
        // input does not accept null for a nullable member).
        const existing = await this.prisma.idempotencyKey.findFirst({
          where: { key, userId, path },
        });
        if (!existing) throw err;

        if (existing.requestHash !== requestHash) {
          throw new ConflictException(
            'Idempotency-Key was already used with a different request body',
          );
        }
        if (existing.completedAt && existing.statusCode != null) {
          return {
            replay: {
              statusCode: existing.statusCode,
              body: existing.responseBody as unknown,
            },
          };
        }
        // Locked but not yet completed → original request still running.
        throw new ConflictException('A request with this Idempotency-Key is still being processed');
      }
      throw err;
    }
  }

  /** Persists the handler's outcome so future replays can be served from the store. */
  async complete(recordId: string, statusCode: number, body: unknown): Promise<void> {
    await this.prisma.idempotencyKey.update({
      where: { id: recordId },
      data: {
        statusCode,
        responseBody: (body ?? null) as Prisma.InputJsonValue,
        completedAt: new Date(),
      },
    });
  }

  /** Releases a reservation when the handler failed, so the client may retry. */
  async release(recordId: string): Promise<void> {
    await this.prisma.idempotencyKey
      .delete({ where: { id: recordId } })
      .catch(() => undefined);
  }
}

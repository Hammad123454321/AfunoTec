import { ConflictException, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IdempotencyKey,
  IdempotencyKeyDocument,
} from '../../database/schemas/idempotency-key.schema';

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

/** Mongo duplicate-key error code (replaces Prisma P2002). */
const MONGO_DUPLICATE_KEY = 11000;

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    (err as { code?: unknown }).code === MONGO_DUPLICATE_KEY
  );
}

/**
 * Durable idempotency store backed by the `IdempotencyKey` collection. Guarantees
 * that a (key, user, path) tuple executes its side effects at most once.
 */
@Injectable()
export class IdempotencyService {
  constructor(
    @InjectModel(IdempotencyKey.name)
    private readonly idempotencyKeyModel: Model<IdempotencyKeyDocument>,
  ) {}

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
      const created = await this.idempotencyKeyModel.create({
        key,
        userId,
        method,
        path,
        requestHash,
        lockedAt: new Date(),
      });
      return { recordId: created.id as string };
    } catch (err) {
      // Unique violation → a record for this (key,user,path) already exists.
      if (isDuplicateKeyError(err)) {
        const existing = await this.idempotencyKeyModel
          .findOne({ key, userId, path })
          .exec();
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
    await this.idempotencyKeyModel
      .findByIdAndUpdate(recordId, {
        $set: {
          statusCode,
          responseBody: body ?? null,
          completedAt: new Date(),
        },
      })
      .exec();
  }

  /** Releases a reservation when the handler failed, so the client may retry. */
  async release(recordId: string): Promise<void> {
    await this.idempotencyKeyModel
      .deleteOne({ _id: recordId })
      .exec()
      .catch(() => undefined);
  }
}

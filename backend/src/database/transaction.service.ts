import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';

/**
 * Runs a unit of work inside a MongoDB multi-document transaction.
 *
 * Replaces Prisma's `$transaction(async (tx) => …)`. The Atlas cluster is a
 * replica set, so transactions are first-class. `withTransaction` automatically
 * commits on success, aborts on throw, retries on transient/commit errors per
 * the driver's built-in retry semantics, and always ends the session.
 *
 * Usage:
 * ```ts
 * await this.tx.run(async (session) => {
 *   await this.fooModel.create([doc], { session });
 *   await this.barModel.updateOne(filter, patch, { session });
 * });
 * ```
 * Every model operation inside the callback MUST be passed `{ session }` to
 * participate in the transaction.
 */
@Injectable()
export class TransactionService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async run<T>(work: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();
    try {
      let result: T;
      await session.withTransaction(async () => {
        result = await work(session);
      });
      return result!;
    } finally {
      await session.endSession();
    }
  }
}

import { MongoMemoryReplSet } from 'mongodb-memory-server';

/**
 * Runs once before all E2E suites.
 *
 * Spins up an in-memory MongoDB **replica set** (required for the multi-document
 * transactions used by bookings/payments/auth) and exposes its URI to the suites
 * via `process.env.MONGODB_URI`. No external database is needed. Mongoose creates
 * collections + indexes on first use, so there is no migration step.
 */
declare global {
  // eslint-disable-next-line no-var
  var __MONGO_REPLSET__: MongoMemoryReplSet | undefined;
}

export default async function globalSetup(): Promise<void> {
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
  });

  global.__MONGO_REPLSET__ = replSet;
  process.env.MONGODB_URI = replSet.getUri();
  process.env.MONGODB_DB_NAME = 'ameer_nasr_test';
}

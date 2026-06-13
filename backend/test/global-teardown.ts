import { MongoMemoryReplSet } from 'mongodb-memory-server';

declare global {
  // eslint-disable-next-line no-var
  var __MONGO_REPLSET__: MongoMemoryReplSet | undefined;
}

/** Runs once after all E2E suites — stops the in-memory replica set. */
export default async function globalTeardown(): Promise<void> {
  const replSet = global.__MONGO_REPLSET__;
  if (replSet) {
    await replSet.stop();
    global.__MONGO_REPLSET__ = undefined;
  }
}

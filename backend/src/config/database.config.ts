import { registerAs } from '@nestjs/config';

/**
 * MongoDB (Atlas) connection configuration.
 *
 * The cluster is shared across platforms; this app is isolated by its own
 * database name (`MONGODB_DB_NAME`). The connection URI's credentials must be
 * percent-encoded if they contain reserved characters (e.g. `( ) * @ : / ?`).
 */
export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGODB_URI ?? '',
  dbName: process.env.MONGODB_DB_NAME ?? 'ameer_nasr',
}));

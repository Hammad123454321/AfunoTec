import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TransactionService } from './transaction.service';

/**
 * Establishes the application's MongoDB connection (Atlas replica set) and
 * exposes the {@link TransactionService} helper for multi-document transactions.
 *
 * Feature modules register their own schemas via `MongooseModule.forFeature([...])`.
 */
@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const logger = new Logger('MongooseModule');
        const uri = config.getOrThrow<string>('database.uri');
        const dbName = config.get<string>('database.dbName', 'ameer_nasr');
        return {
          uri,
          dbName,
          retryWrites: true,
          // Fail fast on a bad connection rather than hanging requests.
          serverSelectionTimeoutMS: 10_000,
          autoIndex: process.env.NODE_ENV !== 'production',
          onConnectionCreate: (connection) => {
            connection.on('connected', () => logger.log(`MongoDB connected (db: ${dbName})`));
            connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
            connection.on('error', (err) => logger.error(`MongoDB error: ${err.message}`));
            return connection;
          },
        };
      },
    }),
  ],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class DatabaseModule {}

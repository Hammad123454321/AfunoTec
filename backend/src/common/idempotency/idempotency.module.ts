import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { IdempotencyService } from './idempotency.service';
import { IdempotencyInterceptor } from './idempotency.interceptor';
import {
  IdempotencyKey,
  IdempotencyKeySchema,
} from '../../database/schemas/idempotency-key.schema';

/**
 * Provides the durable idempotency store and registers the interceptor that
 * enforces `@Idempotent()` routes app-wide. Global so the service can be
 * injected anywhere it's useful.
 */
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IdempotencyKey.name, schema: IdempotencyKeySchema },
    ]),
  ],
  providers: [
    IdempotencyService,
    { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
  ],
  exports: [IdempotencyService],
})
export class IdempotencyModule {}

import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { IdempotencyService } from './idempotency.service';
import { IdempotencyInterceptor } from './idempotency.interceptor';

/**
 * Provides the durable idempotency store and registers the interceptor that
 * enforces `@Idempotent()` routes app-wide. Global so the service can be
 * injected anywhere it's useful.
 */
@Global()
@Module({
  providers: [
    IdempotencyService,
    { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
  ],
  exports: [IdempotencyService],
})
export class IdempotencyModule {}

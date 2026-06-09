import { SetMetadata } from '@nestjs/common';

export const IDEMPOTENT_KEY = 'idempotent';

/**
 * Marks a route as requiring an `Idempotency-Key` header. The
 * IdempotencyInterceptor de-duplicates retries: the first call runs the
 * handler and stores its response; replays with the same key + body return the
 * stored response, and the same key with a different body is rejected (409).
 */
export const Idempotent = (): MethodDecorator => SetMetadata(IDEMPOTENT_KEY, true);

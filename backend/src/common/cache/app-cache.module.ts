import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';

/**
 * Global cache used for read-heavy public endpoints (categories, tags,
 * currencies, i18n strings). Services invalidate keys with `cache.del(...)` on
 * mutation.
 *
 * Defaults to an in-memory store with a 60s TTL. To share the cache across
 * replicas, install `@keyv/redis` and pass a Keyv(Redis) store here — the rest
 * of the code (CACHE_MANAGER usage) is unchanged.
 */
@Global()
@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 60_000, // milliseconds (cache-manager v6)
      max: 1000,
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}

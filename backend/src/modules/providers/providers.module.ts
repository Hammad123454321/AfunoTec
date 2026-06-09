import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';

/**
 * Service-provider onboarding and profile management: customer→provider
 * upgrade (transactional role flip), provider self-service, admin verification
 * and listing, and a public listing of a provider's active services.
 */
@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}

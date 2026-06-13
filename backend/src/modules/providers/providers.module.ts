import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ServiceProviderProfile,
  ServiceProviderProfileSchema,
} from '../../database/schemas/service-provider-profile.schema';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';

/**
 * Service-provider onboarding and profile management: customer→provider
 * upgrade (transactional role flip), provider self-service, admin verification
 * and listing, and a public listing of a provider's active services.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceProviderProfile.name, schema: ServiceProviderProfileSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}

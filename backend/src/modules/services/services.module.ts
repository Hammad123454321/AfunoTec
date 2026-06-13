import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import { ServiceRoom, ServiceRoomSchema } from '../../database/schemas/service-room.schema';
import { Category, CategorySchema } from '../../database/schemas/category.schema';
import { Tag, TagSchema } from '../../database/schemas/tag.schema';
import {
  ServiceProviderProfile,
  ServiceProviderProfileSchema,
} from '../../database/schemas/service-provider-profile.schema';
import {
  ServiceAvailability,
  ServiceAvailabilitySchema,
} from '../../database/schemas/service-availability.schema';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServicePricingService } from './service-pricing.service';
import { ServiceQueryBuilder } from './service-query.builder';

/**
 * Service catalog: provider/admin CRUD, public filtered listing and detail,
 * image management, debounced view tracking, and status transitions.
 * Exports ServicePricingService for reuse by cart and booking pricing.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceRoom.name, schema: ServiceRoomSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: ServiceProviderProfile.name, schema: ServiceProviderProfileSchema },
      { name: ServiceAvailability.name, schema: ServiceAvailabilitySchema },
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService, ServicePricingService, ServiceQueryBuilder],
  exports: [ServicesService, ServicePricingService, MongooseModule],
})
export class ServicesModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ServiceAvailability,
  ServiceAvailabilitySchema,
} from '../../database/schemas/service-availability.schema';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

/**
 * Per-day service availability: public range queries (with synthesized
 * defaults for gaps), and provider/admin bulk-set + single-day overrides.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceAvailability.name, schema: ServiceAvailabilitySchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}

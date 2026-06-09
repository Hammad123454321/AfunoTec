import { Module } from '@nestjs/common';
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
  controllers: [ServicesController],
  providers: [ServicesService, ServicePricingService, ServiceQueryBuilder],
  exports: [ServicesService, ServicePricingService],
})
export class ServicesModule {}

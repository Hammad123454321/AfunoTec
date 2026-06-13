import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from '../../database/schemas/audit-log.schema';
import { Booking, BookingSchema } from '../../database/schemas/booking.schema';
import { Category, CategorySchema } from '../../database/schemas/category.schema';
import { Service, ServiceSchema } from '../../database/schemas/service.schema';
import {
  ServiceProviderProfile,
  ServiceProviderProfileSchema,
} from '../../database/schemas/service-provider-profile.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { AdminController, AdminAuditController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ServiceProviderProfile.name, schema: ServiceProviderProfileSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Category.name, schema: CategorySchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  controllers: [AdminController, AdminAuditController],
  providers: [AdminService],
})
export class AdminModule {}

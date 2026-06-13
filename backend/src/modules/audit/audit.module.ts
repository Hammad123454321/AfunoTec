import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from '../../database/schemas/audit-log.schema';
import { AuditService } from '../../common/audit/audit.service';
import { AuditInterceptor } from '../../common/audit/audit.interceptor';

/**
 * Provides the append-only audit trail and registers the interceptor that logs
 * `@Audit(...)`-annotated mutations app-wide. Global so any service can inject
 * `AuditService` for imperative logging (e.g. login events).
 */
@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }])],
  providers: [
    AuditService,
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
  exports: [AuditService],
})
export class AuditModule {}

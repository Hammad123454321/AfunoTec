import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditService } from '../../common/audit/audit.service';
import { AuditInterceptor } from '../../common/audit/audit.interceptor';

/**
 * Provides the append-only audit trail and registers the interceptor that logs
 * `@Audit(...)`-annotated mutations app-wide. Global so any service can inject
 * `AuditService` for imperative logging (e.g. login events).
 */
@Global()
@Module({
  providers: [
    AuditService,
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
  exports: [AuditService],
})
export class AuditModule {}

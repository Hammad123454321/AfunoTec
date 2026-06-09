import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthUser } from '../decorators/current-user.decorator';
import { AUDIT_KEY, AuditOptions } from './audit.decorator';
import { AuditService } from './audit.service';

/**
 * Writes an `AuditLog` entry after any `@Audit(...)`-annotated route returns
 * successfully. Best-effort: the underlying AuditService never throws.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly audit: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const options = this.reflector.getAllAndOverride<AuditOptions | undefined>(AUDIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!options) return next.handle();

    const req = context.switchToHttp().getRequest<Request>();
    const user = (req as Request & { user?: AuthUser }).user;

    return next.handle().pipe(
      tap((result) => {
        const paramId = req.params?.[options.idParam ?? 'id'];
        const entityId =
          this.extractId(result) ?? (typeof paramId === 'string' ? paramId : null);
        void this.audit.record({
          actorId: user?.id ?? null,
          action: options.action,
          entity: options.entity,
          entityId,
          ip: req.ip ?? null,
          userAgent: req.header('user-agent') ?? null,
        });
      }),
    );
  }

  /** Pulls an `id` from the handler's return value when present. */
  private extractId(result: unknown): string | null {
    if (result && typeof result === 'object' && 'id' in result) {
      const id = (result as { id?: unknown }).id;
      return typeof id === 'string' ? id : null;
    }
    return null;
  }
}

import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable, from, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthUser } from '../decorators/current-user.decorator';
import { IDEMPOTENT_KEY } from './idempotent.decorator';
import { IdempotencyService } from './idempotency.service';
import { ErrorCode } from '../errors/error-code.enum';

/**
 * Enforces the `Idempotency-Key` contract on routes annotated with
 * `@Idempotent()`. On first use it runs the handler and stores the result; on
 * replay it short-circuits and returns the stored response.
 *
 * Note: the stored/returned value here is the handler's raw return value, which
 * the global TransformResponseInterceptor then wraps in the success envelope.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly idempotency: IdempotencyService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const isIdempotent = this.reflector.getAllAndOverride<boolean>(IDEMPOTENT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isIdempotent) return next.handle();

    const req = context.switchToHttp().getRequest<Request>();
    const headerKey = req.header('Idempotency-Key');
    if (!headerKey) {
      throw new BadRequestException({
        message: 'Idempotency-Key header is required for this endpoint',
        code: ErrorCode.VALIDATION_FAILED,
      });
    }

    const user = (req as Request & { user?: AuthUser }).user;
    const requestHash = this.idempotency.hashRequest(req.body);

    return from(
      this.idempotency.begin({
        key: headerKey,
        userId: user?.id ?? null,
        method: req.method,
        path: req.path,
        requestHash,
      }),
    ).pipe(
      switchMap((result) => {
        if (result.replay) {
          // Serve the previously stored handler return value.
          return of(result.replay.body);
        }
        const recordId = result.recordId as string;
        return next.handle().pipe(
          tap({
            next: (body) => {
              void this.idempotency.complete(recordId, 200, body);
            },
          }),
          catchError((err) => {
            // Release so the client can legitimately retry after a failure.
            void this.idempotency.release(recordId);
            throw err;
          }),
        );
      }),
    );
  }
}

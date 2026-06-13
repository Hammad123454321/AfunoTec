import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

/**
 * Wraps every successful response in a consistent envelope:
 *   { success: true, statusCode, message, data, meta? }
 *
 * Frontend expects this exact shape — see `types/global.ts > IBaseResponse`.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector = new Reflector()) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<unknown>> {
    return next.handle().pipe(
      map((payload) => {
        const res = context.switchToHttp().getResponse();
        const statusCode: number = res.statusCode ?? 200;

        if (payload && typeof payload === 'object' && 'data' in payload && 'success' in payload) {
          // already shaped — pass through
          return payload as ApiSuccessResponse<unknown>;
        }

        let message = 'OK';
        let data: unknown = payload;
        let meta: Record<string, unknown> | undefined;

        if (payload && typeof payload === 'object') {
          const p = payload as Record<string, unknown>;
          if (typeof p.message === 'string') {
            message = p.message;
            data = p.data ?? null;
            if (p.meta && typeof p.meta === 'object') meta = p.meta as Record<string, unknown>;
          } else if ('data' in p) {
            // Service returns { data, meta? } without a message — unwrap directly.
            data = p.data ?? null;
            if (p.meta && typeof p.meta === 'object') meta = p.meta as Record<string, unknown>;
          }
        }

        return { success: true, statusCode, message, data, meta };
      }),
    );
  }
}

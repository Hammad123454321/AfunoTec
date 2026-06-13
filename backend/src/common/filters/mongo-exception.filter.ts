import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { defaultCodeForStatus } from '../errors/error-code.enum';

/**
 * Translates low-level MongoDB / Mongoose persistence errors into the standard
 * error envelope. Replaces the former Prisma exception filter.
 *
 *   - Mongo duplicate key (11000)        → 409 Conflict
 *   - Mongoose ValidationError           → 400 Bad Request
 *   - Mongoose CastError (bad ObjectId)  → 400 Bad Request
 *   - VersionError (optimistic lock)     → 409 Conflict
 *   - everything else                    → 500 Internal
 *
 * "Document not found" is intentionally NOT handled here: services raise an
 * explicit `NotFoundException`, which the HTTP filter already maps to 404.
 */
@Catch(MongoServerError, MongooseError.ValidationError, MongooseError.CastError, MongooseError.VersionError)
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongoExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    if (exception instanceof MongoServerError && exception.code === 11000) {
      status = HttpStatus.CONFLICT;
      const field = Object.keys(exception.keyPattern ?? {}).join(', ');
      message = field
        ? `A record with the same ${field} already exists`
        : 'A record with the same unique field already exists';
    } else if (exception instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid input';
    } else if (exception instanceof MongooseError.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid value for '${exception.path}'`;
    } else if (exception instanceof MongooseError.VersionError) {
      status = HttpStatus.CONFLICT;
      message = 'The record was modified concurrently; please retry';
    }

    const errAny = exception as { message?: string; constructor?: { name?: string } };
    this.logger.error(
      `${errAny?.constructor?.name ?? 'MongoError'}: ${errAny?.message ?? 'unknown'}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      code: defaultCodeForStatus(status),
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

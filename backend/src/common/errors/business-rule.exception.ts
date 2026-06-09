import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code.enum';

/**
 * Thrown when a request is syntactically valid but violates a domain rule
 * (e.g. booking outside the availability window, reviewing without a completed
 * booking). Maps to HTTP 422 with code `BUSINESS_RULE_VIOLATION`.
 */
export class BusinessRuleException extends HttpException {
  constructor(message: string, details?: unknown) {
    super(
      {
        message,
        code: ErrorCode.BUSINESS_RULE_VIOLATION,
        errors: details,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

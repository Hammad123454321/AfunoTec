/**
 * Canonical machine-readable error codes echoed in the error envelope's `code`
 * field. Mirrors the catalogue in docs/04-api-contract.md so clients can branch
 * on a stable code rather than parsing messages.
 */
export enum ErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED', // 400
  UNAUTHENTICATED = 'UNAUTHENTICATED', // 401
  FORBIDDEN = 'FORBIDDEN', // 403
  NOT_FOUND = 'NOT_FOUND', // 404
  CONFLICT = 'CONFLICT', // 409
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION', // 422
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS', // 429
  INTERNAL = 'INTERNAL', // 500
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED', // 501
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // 503
}

/** Maps an HTTP status to its default catalogue code (fallback when none is supplied). */
export function defaultCodeForStatus(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ErrorCode.VALIDATION_FAILED;
    case 401:
      return ErrorCode.UNAUTHENTICATED;
    case 403:
      return ErrorCode.FORBIDDEN;
    case 404:
      return ErrorCode.NOT_FOUND;
    case 409:
      return ErrorCode.CONFLICT;
    case 422:
      return ErrorCode.BUSINESS_RULE_VIOLATION;
    case 429:
      return ErrorCode.TOO_MANY_REQUESTS;
    case 501:
      return ErrorCode.NOT_IMPLEMENTED;
    case 503:
      return ErrorCode.SERVICE_UNAVAILABLE;
    default:
      return ErrorCode.INTERNAL;
  }
}

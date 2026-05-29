export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)));
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  return {
    page: safePage,
    limit: safeLimit,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

export function clampPagination(
  page?: number,
  limit?: number,
): { skip: number; take: number; page: number; limit: number } {
  const p = Math.max(1, Math.floor(page ?? 1));
  const l = Math.max(1, Math.min(100, Math.floor(limit ?? 20)));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
}

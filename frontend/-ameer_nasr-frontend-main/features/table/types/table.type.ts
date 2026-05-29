export type BaseSearchParams = {
  page?: number;
  limit?: number;
  sort?: string;
  query?: string;
};

export type SortDirection = "asc" | "desc" | null;

export type TableSearchParams<T extends Record<string, unknown> = {}> =
  BaseSearchParams & T;

export type TableProps<T extends Record<string, unknown> = {}> = {
  searchParams: Promise<TableSearchParams<T>>;
};

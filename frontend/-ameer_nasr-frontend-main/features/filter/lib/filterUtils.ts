export function parseFiltersFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): Record<string, string | string[]> {
  const filters: Record<string, string | string[]> = {};

  Object.entries(searchParams).forEach(([key, value]) => {
    if (key !== "page" && value) {
      try {
        const parsed = JSON.parse(Array.isArray(value) ? value[0] : value);
        filters[key] = parsed;
      } catch {
        filters[key] = Array.isArray(value) ? value[0] : value;
      }
    }
  });

  return filters;
}

export function buildFilterQueryString(
  filters: Record<string, string | string[]>
): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, JSON.stringify(value));
      } else if (!Array.isArray(value) && value !== "") {
        params.set(key, JSON.stringify(value));
      }
    }
  });

  return params.toString();
}

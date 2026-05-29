"use client";

import { useSearchParams } from "next/navigation";

export function useFilterValues(): Record<string, string | string[]> {
  const searchParams = useSearchParams();
  const filters: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    if (key !== "page") {
      try {
        filters[key] = JSON.parse(value);
      } catch {
        filters[key] = value;
      }
    }
  });

  return filters;
}

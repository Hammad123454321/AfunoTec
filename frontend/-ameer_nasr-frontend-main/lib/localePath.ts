import { getLocale } from "next-intl/server";
import { useLocale } from "next-intl";

/**
 * Always prefixes path with current locale
 * e.g. /en/admin, /fr/admin, /mg/admin
 */

// Server-side
export async function prefixLocalePath(path: string) {
  const locale = await getLocale();
  return `/${locale}${path}`;
}

// Client-side hook
export function usePrefixedPath(path: string) {
  const locale = useLocale();
  return `/${locale}${path}`;
}

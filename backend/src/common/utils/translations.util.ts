/** Supported UI locales. `en` is the canonical fallback. */
export const SUPPORTED_LOCALES = ['en', 'fr', 'mg'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export type TranslationMap = Partial<Record<Locale, unknown>>;

/** Normalizes an arbitrary locale string to a supported locale (default `en`). */
export function normalizeLocale(input?: string | null): Locale {
  const lower = (input ?? '').slice(0, 2).toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(lower)
    ? (lower as Locale)
    : DEFAULT_LOCALE;
}

/**
 * Resolves the value for a locale from a `{ en, fr, mg }` translations map,
 * falling back to `en` and then to any present locale. Works for both flat
 * string maps (LocaleString) and nested per-locale objects (Category/Service).
 */
export function resolveTranslation<T = unknown>(
  translations: TranslationMap | null | undefined,
  locale: Locale,
  fallback?: T,
): T | undefined {
  if (!translations) return fallback;
  const direct = translations[locale];
  if (direct !== undefined && direct !== null) return direct as T;
  const en = translations[DEFAULT_LOCALE];
  if (en !== undefined && en !== null) return en as T;
  for (const loc of SUPPORTED_LOCALES) {
    const v = translations[loc];
    if (v !== undefined && v !== null) return v as T;
  }
  return fallback;
}

/**
 * Resolves a single localized field from a nested translations map
 * (`{ en: { name }, fr: { name } }`), falling back to a canonical column value.
 */
export function resolveLocalizedField(
  translations: TranslationMap | null | undefined,
  locale: Locale,
  field: string,
  canonical?: string | null,
): string | undefined {
  // Prefer the requested locale; otherwise fall back to the canonical column
  // value rather than an arbitrary other language. (The canonical name is
  // typically authored in English, so it is the right fallback for `en`.)
  const pick = (loc: Locale): string | undefined => {
    const localized = translations?.[loc];
    const value =
      localized && typeof localized === 'object'
        ? (localized as Record<string, unknown>)[field]
        : undefined;
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  };
  return pick(locale) ?? canonical ?? pick(DEFAULT_LOCALE);
}

/** Shallow-merges incoming translation patches over the existing map. */
export function mergeTranslations(
  existing: TranslationMap | null | undefined,
  incoming: TranslationMap | null | undefined,
): TranslationMap {
  return { ...(existing ?? {}), ...(incoming ?? {}) };
}

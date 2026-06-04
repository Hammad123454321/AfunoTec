/**
 * Country list used by the checkout guest form.
 *
 * Madagascar is always pinned first because that's where most
 * bookings land. The rest is alphabetical by English name and
 * covers the major markets that send tourists to Madagascar
 * (Africa + Europe + Indian Ocean + a handful of others). The list
 * stays intentionally compact; if the business needs a complete ISO
 * 3166-1 set later we can swap it for the `country-list` npm package.
 */
export type Country = {
  /** ISO 3166-1 alpha-2 code. */
  code: string;
  /** English display name. */
  name: string;
  /** E.164 calling code without the `+`. */
  dial: string;
  /** Emoji flag for visual hint in the select. */
  flag: string;
};

export const COUNTRIES: ReadonlyArray<Country> = [
  { code: "MG", name: "Madagascar", dial: "261", flag: "🇲🇬" },
  // Africa & Indian Ocean
  { code: "MU", name: "Mauritius", dial: "230", flag: "🇲🇺" },
  { code: "SC", name: "Seychelles", dial: "248", flag: "🇸🇨" },
  { code: "KM", name: "Comoros", dial: "269", flag: "🇰🇲" },
  { code: "RE", name: "Réunion", dial: "262", flag: "🇷🇪" },
  { code: "ZA", name: "South Africa", dial: "27", flag: "🇿🇦" },
  { code: "KE", name: "Kenya", dial: "254", flag: "🇰🇪" },
  { code: "TZ", name: "Tanzania", dial: "255", flag: "🇹🇿" },
  { code: "MZ", name: "Mozambique", dial: "258", flag: "🇲🇿" },
  { code: "MA", name: "Morocco", dial: "212", flag: "🇲🇦" },
  // Europe
  { code: "FR", name: "France", dial: "33", flag: "🇫🇷" },
  { code: "BE", name: "Belgium", dial: "32", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", dial: "41", flag: "🇨🇭" },
  { code: "DE", name: "Germany", dial: "49", flag: "🇩🇪" },
  { code: "IT", name: "Italy", dial: "39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dial: "34", flag: "🇪🇸" },
  { code: "GB", name: "United Kingdom", dial: "44", flag: "🇬🇧" },
  { code: "NL", name: "Netherlands", dial: "31", flag: "🇳🇱" },
  { code: "PT", name: "Portugal", dial: "351", flag: "🇵🇹" },
  // Asia
  { code: "AE", name: "United Arab Emirates", dial: "971", flag: "🇦🇪" },
  { code: "IN", name: "India", dial: "91", flag: "🇮🇳" },
  { code: "CN", name: "China", dial: "86", flag: "🇨🇳" },
  { code: "JP", name: "Japan", dial: "81", flag: "🇯🇵" },
  // Americas
  { code: "US", name: "United States", dial: "1", flag: "🇺🇸" },
  { code: "CA", name: "Canada", dial: "1", flag: "🇨🇦" },
  { code: "BR", name: "Brazil", dial: "55", flag: "🇧🇷" },
  // Oceania
  { code: "AU", name: "Australia", dial: "61", flag: "🇦🇺" },
] as const;

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Madagascar

export function findCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

import slugify from 'slugify';

/** Produces a URL-safe, lowercase, strict slug from arbitrary text. */
export function toSlug(input: string): string {
  return slugify(input, { lower: true, strict: true, trim: true });
}

/**
 * Returns a slug guaranteed unique against `exists`, appending `-2`, `-3`, …
 * on collision. `exists(candidate)` should resolve true when the candidate is
 * already taken (caller supplies the Prisma lookup, scoped as needed).
 */
export async function ensureUniqueSlug(
  base: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const root = toSlug(base) || 'item';
  let candidate = root;
  let suffix = 2;
  while (await exists(candidate)) {
    candidate = `${root}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

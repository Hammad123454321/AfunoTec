import { SchemaOptions } from 'mongoose';

/**
 * Projects a lean/plain Mongoose document (`{ _id, ... }`) into an API record
 * that exposes a string `id` and drops `_id`/`__v`. Mirrors the toJSON virtual
 * for code paths that use `.lean()` (which bypasses virtuals).
 */
export function toRecord<T = Record<string, unknown>>(
  doc: { _id: { toString(): string }; __v?: unknown } & Record<string, unknown>,
): T & { id: string } {
  const { _id, __v: _ignore, ...rest } = doc;
  return { id: _id.toString(), ...rest } as T & { id: string };
}

/**
 * Shared Mongoose schema options applied to every top-level collection schema.
 *
 *  - `timestamps`     → manages `createdAt` / `updatedAt` (replaces Prisma's
 *                       `@default(now())` / `@updatedAt`).
 *  - `toJSON` virtuals → expose a string `id` (hex of `_id`), drop `_id`/`__v`,
 *                       so the API contract keeps emitting `id` exactly as the
 *                       Prisma (`cuid`) version did.
 *  - `optimisticConcurrency` is enabled per-schema where oversell/double-write
 *    protection matters (booking, availability, payment) — not globally.
 */
export function baseSchemaOptions(collection: string): SchemaOptions {
  return {
    collection,
    timestamps: true,
    versionKey: '__v',
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  };
}

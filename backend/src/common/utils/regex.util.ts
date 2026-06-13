/** Escapes user input for safe literal use inside a RegExp (case-insensitive search). */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

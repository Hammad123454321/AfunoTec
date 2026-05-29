import { customAlphabet } from 'nanoid';

/** Human-readable booking/order reference: 8 chars from unambiguous alphabet (no 0/O, 1/I). */
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const generator = customAlphabet(alphabet, 8);

export function generateReferenceCode(prefix?: string): string {
  return prefix ? `${prefix}-${generator()}` : generator();
}

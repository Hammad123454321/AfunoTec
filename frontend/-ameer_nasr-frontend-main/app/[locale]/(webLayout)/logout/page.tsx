import { logoutAction } from "./actions";

/**
 * Sync server-component logout — runs the action then redirects.
 * Nothing renders because the action throws `NEXT_REDIRECT`, but we
 * still return a small fallback for the brief window between the
 * server render and the browser following the 307.
 */
export default async function LogoutPage() {
  await logoutAction();
  return null;
}

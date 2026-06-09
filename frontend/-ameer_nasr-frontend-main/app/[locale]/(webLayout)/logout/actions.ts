"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side logout. Removes every auth cookie the app currently
 * issues (matches `redux/features/user/userSlice.ts > logout` for the
 * client-side reducer) and bounces the user back to the home page.
 *
 * Called once from `logout/page.tsx`; safe to import elsewhere if we
 * later need a "log everyone out" admin action.
 */
const AUTH_COOKIES = ["accessToken", "refreshToken", "authUser", "token"] as const;

export async function logoutAction(): Promise<never> {
  const jar = await cookies();
  for (const name of AUTH_COOKIES) {
    jar.delete(name);
  }
  redirect("/");
}

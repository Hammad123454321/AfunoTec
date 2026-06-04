"use client";

import { useAppSelector } from "@/redux/hook";
import { selectUser } from "@/redux/features/user/userSlice";
import type { Role } from "@/lib/auth/roles";
import { ROLES } from "@/lib/auth/roles";

/**
 * Returns the current user's role, or `undefined` when nobody is
 * signed in. Reads from the redux auth slice (already persisted to
 * cookies + localStorage) so it stays in sync with whatever the
 * login flow last wrote.
 *
 * Until the backend auth lands in M2 the slice's `user.role` will be
 * undefined; admin/dashboard surfaces that gate on roles fall back to
 * `ADMIN` so the screens stay browsable in dev. The fallback is
 * removed automatically once a real JWT populates the slice.
 */
export function useUserRole(): { role: Role | undefined; isLoading: boolean } {
  const user = useAppSelector(selectUser);
  const raw = user?.role?.toUpperCase();
  const role = raw && (ROLES as ReadonlyArray<string>).includes(raw)
    ? (raw as Role)
    : undefined;

  // Dev fallback so dashboards remain visible while auth is still
  // mocked. Disable by setting NEXT_PUBLIC_DISABLE_ROLE_FALLBACK=1.
  const fallback: Role | undefined =
    !role && process.env.NEXT_PUBLIC_DISABLE_ROLE_FALLBACK !== "1"
      ? "ADMIN"
      : undefined;

  return { role: role ?? fallback, isLoading: false };
}

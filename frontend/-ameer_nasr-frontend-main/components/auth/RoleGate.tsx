"use client";

import type { ReactNode } from "react";
import type { Role } from "@/lib/auth/roles";
import { hasRole } from "@/lib/auth/roles";
import { useUserRole } from "@/hooks/useUserRole";

interface RoleGateProps {
  /** Roles permitted to see `children`. */
  allow: ReadonlyArray<Role>;
  /** What to render when the current user is allowed. */
  children: ReactNode;
  /**
   * What to render when the user is NOT allowed. Defaults to nothing
   * so the absence is silent. Pass an explicit fallback for places
   * where a "you don't have access" message is helpful.
   */
  fallback?: ReactNode;
}

/**
 * Tiny declarative wrapper:
 *   <RoleGate allow={["ADMIN", "MANAGER"]}>
 *     <BookingsTable />
 *   </RoleGate>
 *
 * Uses {@link useUserRole} so it stays in sync with the redux auth
 * slice. When auth lands in M2 nothing in callers needs to change.
 */
export function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { role } = useUserRole();
  return hasRole(role, allow) ? <>{children}</> : <>{fallback}</>;
}

export default RoleGate;

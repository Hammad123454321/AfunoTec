/**
 * Canonical role union — mirrors `backend/src/common/decorators/roles.decorator.ts`
 * so the same string values flow from JWT claims straight into the UI.
 */
export const ROLES = [
  "ADMIN",
  "MANAGER",
  "AGENT",
  "INFLUENCER",
  "SERVICE_PROVIDER",
  "CUSTOMER",
] as const;

export type Role = (typeof ROLES)[number];

/** Anything that returns truthy means the role is in the allow-list. */
export function hasRole(role: Role | undefined, allow: ReadonlyArray<Role>) {
  return role !== undefined && allow.includes(role);
}

/**
 * Human-readable labels for the rare places we need to render a role
 * name (e.g. an admin user-management table column).
 */
export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  AGENT: "Agent",
  INFLUENCER: "Influencer",
  SERVICE_PROVIDER: "Service Provider",
  CUSTOMER: "Customer",
};

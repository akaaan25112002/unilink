export const USER_ROLES = [
  "STUDENT",
  "ADMIN_OFFICER",
  "SUPPORT_OFFICER",
  "MANAGER",
  "IT_SUPPORT",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_HOME: Record<UserRole, string> = {
  STUDENT: "/student",
  ADMIN_OFFICER: "/admin",
  SUPPORT_OFFICER: "/officer",
  MANAGER: "/manager",
  IT_SUPPORT: "/it",
};
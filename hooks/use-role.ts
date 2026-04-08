import { useMemo } from "react";
import type { UserRole } from "@/lib/auth/roles";

export function useRole(role?: UserRole) {
  return useMemo(
    () => ({
      isStudent: role === "STUDENT",
      isAdminOfficer: role === "ADMIN_OFFICER",
      isSupportOfficer: role === "SUPPORT_OFFICER",
      isManager: role === "MANAGER",
      isItSupport: role === "IT_SUPPORT",
    }),
    [role],
  );
}
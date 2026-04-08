import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import type { UserRole } from "@/lib/auth/roles";
import { ROLE_HOME } from "@/lib/auth/roles";
import { ROUTES } from "@/lib/constants/routes";

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.login);
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect(ROLE_HOME[user.role]);
  }

  return user;
}
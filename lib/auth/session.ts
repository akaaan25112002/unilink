import { createClient } from "@/lib/supabase/server";
import { USER_ROLES, type UserRole } from "@/lib/auth/roles";

type CurrentUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (error) {
    throw error;
  }

  const role: UserRole = isUserRole(profile?.role) ? profile.role : "STUDENT";

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? "User",
    role,
  };
}
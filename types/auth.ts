import type { UserRole } from "@/lib/auth/roles";

export type AppUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};
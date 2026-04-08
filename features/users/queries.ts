import { createClient } from "@/lib/supabase/server";

export type SupportOfficerOption = {
  id: string;
  full_name: string | null;
};

export async function getSupportOfficers(): Promise<SupportOfficerOption[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "SUPPORT_OFFICER")
    .order("full_name", { ascending: true });

  if (error || !data) {
    console.error("getSupportOfficers error:", error);
    return [];
  }

  return data as SupportOfficerOption[];
}

export async function getUsers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("getUsers error:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    fullName: row.full_name ?? "Unknown User",
    email: "Managed via auth.users",
    role: row.role as
      | "STUDENT"
      | "ADMIN_OFFICER"
      | "SUPPORT_OFFICER"
      | "MANAGER"
      | "IT_SUPPORT",
    active: true,
  }));
}
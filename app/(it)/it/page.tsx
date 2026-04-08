import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { createClient } from "@/lib/supabase/server";

async function getItStats() {
  const supabase = await createClient();

  const [{ count: users }, { count: students }, { count: officers }, { count: managers }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "STUDENT"),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "SUPPORT_OFFICER"),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "MANAGER"),
    ]);

  return {
    users: users ?? 0,
    students: students ?? 0,
    officers: officers ?? 0,
    managers: managers ?? 0,
  };
}

export default async function ItDashboardPage() {
  const stats = await getItStats();

  return (
    <div className="space-y-8">
      <PageHeader
        title="IT Support Dashboard"
        description="Manage access, roles, and system user administration."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats.users} />
        <StatCard label="Students" value={stats.students} />
        <StatCard label="Support Officers" value={stats.officers} />
        <StatCard label="Managers" value={stats.managers} />
      </div>
    </div>
  );
}
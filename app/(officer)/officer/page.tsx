import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

async function getOfficerDashboardStats() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { assigned: 0, inProgress: 0, escalated: 0, resolved: 0 };
  }

  const [{ count: assigned }, { count: inProgress }, { count: escalated }, { count: resolved }] =
    await Promise.all([
      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true })
        .eq("assigned_officer_id", user.id),
      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true })
        .eq("assigned_officer_id", user.id)
        .eq("status", "IN_PROGRESS"),
      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true })
        .eq("assigned_officer_id", user.id)
        .eq("status", "ESCALATED"),
      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true })
        .eq("assigned_officer_id", user.id)
        .in("status", ["RESOLVED", "CLOSED"]),
    ]);

  return {
    assigned: assigned ?? 0,
    inProgress: inProgress ?? 0,
    escalated: escalated ?? 0,
    resolved: resolved ?? 0,
  };
}

export default async function OfficerDashboardPage() {
  const stats = await getOfficerDashboardStats();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Support Officer Dashboard"
        description="Manage assigned cases, update status, and coordinate follow-up."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Assigned Cases" value={stats.assigned} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Escalated" value={stats.escalated} />
        <StatCard label="Resolved / Closed" value={stats.resolved} />
      </div>
    </div>
  );
}
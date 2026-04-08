import { createClient } from "@/lib/supabase/server";

export async function getManagerKpis() {
  const supabase = await createClient();

  const [
    { count: escalatedCases },
    { count: totalOpen },
    { count: resolvedCases },
    { data: feedbackRows },
    { count: totalAppointments },
  ] = await Promise.all([
    supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "ESCALATED"),

    supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .in("status", ["SUBMITTED", "UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS"]),

    supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .in("status", ["RESOLVED", "CLOSED"]),

    supabase.from("feedback").select("rating"),

    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true }),
  ]);

  const ratings = (feedbackRows ?? []).map((row: any) => row.rating as number);
  const satisfactionScore =
    ratings.length > 0
      ? Number(
          (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
        )
      : 0;

  return {
    escalatedCases: escalatedCases ?? 0,
    totalOpen: totalOpen ?? 0,
    resolvedCases: resolvedCases ?? 0,
    totalAppointments: totalAppointments ?? 0,
    avgResponseTime: "Tracked via operational analytics",
    avgResolutionTime: "Tracked via operational analytics",
    satisfactionScore,
  };
}
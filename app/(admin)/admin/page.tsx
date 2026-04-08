import Link from "next/link";
import { ArrowRight, ClipboardList, UserPlus, CheckCircle2 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { Enquiry } from "@/types/enquiry";

type AdminDbEnquiryRow = {
  id: string;
  enquiry_code: string | null;
  subject: string;
  description: string;
  category: Enquiry["category"];
  ai_suggested_category: Enquiry["aiSuggestedCategory"];
  status: Enquiry["status"];
  priority: Enquiry["priority"];
  created_at: string;
  updated_at: string;
  student_id: string;
  assigned_officer_id: string | null;
  profiles: { full_name: string | null }[] | null;
};

function mapAdminEnquiry(row: AdminDbEnquiryRow): Enquiry {
  return {
    id: row.id,
    enquiryCode: row.enquiry_code ?? `ENQ-${row.id.slice(0, 8).toUpperCase()}`,
    studentId: row.student_id,
    studentName: row.profiles?.[0]?.full_name ?? "Student",
    subject: row.subject,
    description: row.description,
    category: row.category,
    aiSuggestedCategory: row.ai_suggested_category,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assignedOfficerId: row.assigned_officer_id,
  };
}

async function getAdminDashboardData() {
  const supabase = await createClient();

  const [
    { count: total },
    { count: submitted },
    { count: assigned },
    { count: resolved },
    { data: recentRows },
  ] = await Promise.all([
    supabase.from("enquiries").select("*", { count: "exact", head: true }),
    supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "SUBMITTED"),
    supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "ASSIGNED"),
    supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true })
      .in("status", ["RESOLVED", "CLOSED"]),
    supabase
      .from("enquiries")
      .select(`
        id,
        enquiry_code,
        subject,
        description,
        category,
        ai_suggested_category,
        status,
        priority,
        created_at,
        updated_at,
        student_id,
        assigned_officer_id,
        profiles:student_id (
          full_name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    stats: {
      total: total ?? 0,
      submitted: submitted ?? 0,
      assigned: assigned ?? 0,
      resolved: resolved ?? 0,
    },
    recent: ((recentRows ?? []) as AdminDbEnquiryRow[]).map(mapAdminEnquiry),
  };
}

export default async function AdminDashboardPage() {
  const { stats, recent } = await getAdminDashboardData();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Administrative Officer Dashboard"
        description="Review, triage, and route student enquiries efficiently."
        actions={
          <Button asChild className="gap-2">
            <Link href="/admin/enquiries">
              Open Queue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Enquiries" value={stats.total} />
        <StatCard label="New / Submitted" value={stats.submitted} />
        <StatCard label="Assigned" value={stats.assigned} />
        <StatCard label="Resolved / Closed" value={stats.resolved} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-2xl xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.length === 0 ? (
              <p className="text-sm text-slate-500">No enquiries available.</p>
            ) : (
              recent.map((item) => (
                <Link
                  key={item.id}
                  href={`/admin/enquiries/${item.id}`}
                  className="block rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.subject}</p>
                      <p className="text-sm text-slate-500">
                        {item.studentName} • {item.enquiryCode}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">{item.status}</p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Triage Queue</p>
                <p className="mt-1 text-sm text-slate-500">
                  Review incoming enquiries and decide whether they should be resolved directly or assigned.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Assignment</p>
                <p className="mt-1 text-sm text-slate-500">
                  Route complex cases to the right support officer with internal context.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Resolution</p>
                <p className="mt-1 text-sm text-slate-500">
                  Update case status, maintain auditability, and keep students informed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
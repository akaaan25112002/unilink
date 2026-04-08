import Link from "next/link";
import { Plus, CalendarDays, MessageSquareMore } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentEnquiries } from "@/features/enquiries/queries";

export default async function StudentDashboardPage() {
  const enquiries = await getStudentEnquiries();

  const openCount = enquiries.filter(
    (e) => !["RESOLVED", "CLOSED"].includes(e.status)
  ).length;

  const resolvedCount = enquiries.filter((e) =>
    ["RESOLVED", "CLOSED"].includes(e.status)
  ).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Student Dashboard"
        description="Submit enquiries, track progress, manage appointments, and provide feedback."
        actions={
          <Button asChild className="gap-2 rounded-xl">
            <Link href="/student/enquiries/new">
              <Plus className="h-4 w-4" />
              New Enquiry
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Enquiries" value={enquiries.length} />
        <StatCard label="Open Cases" value={openCount} />
        <StatCard label="Resolved Cases" value={resolvedCount} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {enquiries.length === 0 ? (
              <p className="text-sm text-slate-500">No enquiries submitted yet.</p>
            ) : (
              enquiries.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={`/student/enquiries/${item.id}`}
                  className="block rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.subject}</p>
                      <p className="text-sm text-slate-500">
                        {item.enquiryCode} • {item.category}
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
                <MessageSquareMore className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Need support?</p>
                <p className="mt-1 text-sm text-slate-500">
                  Submit a new enquiry and track every update in one place.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Appointments</p>
                <p className="mt-1 text-sm text-slate-500">
                  Consultation bookings will appear here once a support officer sends you a booking link.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { getManagerKpis } from "@/features/reports/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ManagerDashboardPage() {
  const kpis = await getManagerKpis();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manager Dashboard"
        description="Monitor escalations, service quality, resolution outcomes, and operational pressure."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Escalated Cases" value={kpis.escalatedCases} />
        <StatCard label="Open Cases" value={kpis.totalOpen} />
        <StatCard label="Resolved Cases" value={kpis.resolvedCases} />
        <StatCard label="Satisfaction Score" value={kpis.satisfactionScore} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-2xl xl:col-span-2">
          <CardHeader>
            <CardTitle>Management Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              Use this workspace to monitor escalated enquiries, identify bottlenecks,
              and intervene in unresolved or high-priority cases.
            </p>
            <p>
              The dashboard highlights pressure points across the enquiry lifecycle,
              while reports summarise resolution outcomes and student feedback.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Total booked appointments: {kpis.totalAppointments}</p>
            <p>Response time metric: {kpis.avgResponseTime}</p>
            <p>Resolution time metric: {kpis.avgResolutionTime}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
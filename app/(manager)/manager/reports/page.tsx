import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { getManagerKpis } from "@/features/reports/queries";

export default async function ManagerReportsPage() {
  const kpis = await getManagerKpis();

  return (
    <div className="space-y-8">
      <PageHeader
        title="KPI Reports"
        description="Monitor operational performance, escalations, appointments, and student feedback."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Escalated Cases</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpis.escalatedCases}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Open Cases</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpis.totalOpen}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Resolved Cases</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpis.resolvedCases}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpis.totalAppointments}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            {kpis.avgResponseTime}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Satisfaction Score</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {kpis.satisfactionScore}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
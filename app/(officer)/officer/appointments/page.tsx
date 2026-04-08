import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateSlotForm } from "@/components/forms/create-slot-form";
import {
  getOfficerAppointments,
  getOfficerSlots,
} from "@/features/appointments/queries";

type OfficerAppointmentRow = {
  id: string;
  enquiry_id: string;
  student_id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  notes: string | null;
};

type OfficerSlotRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  meeting_mode: string | null;
  notes: string | null;
  is_booked: boolean;
};

export default async function OfficerAppointmentsPage() {
  const [appointments, slots] = await Promise.all([
    getOfficerAppointments(),
    getOfficerSlots(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Appointment Management"
        description="Create availability slots so students can book consultations directly from their enquiry page."
      />

      <CreateSlotForm />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Availability Slots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(slots as OfficerSlotRow[]).length === 0 ? (
              <p className="text-sm text-slate-500">
                No availability slots created yet.
              </p>
            ) : (
              (slots as OfficerSlotRow[]).map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-xl border border-slate-200 p-4 text-sm"
                >
                  <p className="font-medium text-slate-900">
                    {new Date(slot.starts_at).toLocaleString()}
                  </p>
                  <p className="text-slate-500">
                    Ends: {new Date(slot.ends_at).toLocaleTimeString()}
                  </p>
                  <p className="text-slate-500">
                    Mode: {slot.meeting_mode ?? "—"}
                  </p>
                  <p className="text-slate-500">
                    Location: {slot.location ?? "—"}
                  </p>
                  <p className="text-slate-500">
                    Slot status: {slot.is_booked ? "Booked by student" : "Available"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Booked Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(appointments as OfficerAppointmentRow[]).length === 0 ? (
              <p className="text-sm text-slate-500">
                No appointments have been booked yet.
              </p>
            ) : (
              (appointments as OfficerAppointmentRow[]).map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-xl border border-slate-200 p-4 text-sm"
                >
                  <p className="font-medium text-slate-900">
                    Appointment #{appointment.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-slate-500">
                    Enquiry: {appointment.enquiry_id}
                  </p>
                  <p className="text-slate-500">
                    Student: {appointment.student_id}
                  </p>
                  <p className="text-slate-500">
                    Starts: {new Date(appointment.starts_at).toLocaleString()}
                  </p>
                  <p className="text-slate-500">Status: {appointment.status}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudentAppointments, getAvailableSlotsForEnquiry } from "@/features/appointments/queries";
import { getStudentEnquiries } from "@/features/enquiries/queries";
import { BookEnquirySlotForm } from "@/components/forms/book-enquiry-slot-form";
import { Button } from "@/components/ui/button";

type AppointmentRow = {
  id: string;
  enquiry_id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  notes: string | null;
};

export default async function StudentAppointmentsPage() {
  const [appointments, enquiries] = await Promise.all([
    getStudentAppointments(),
    getStudentEnquiries(),
  ]);

  const activeEnquiries = enquiries.filter((item) =>
    ["ASSIGNED", "IN_PROGRESS", "UNDER_REVIEW", "ESCALATED"].includes(item.status)
  );

  const enquirySlots = await Promise.all(
    activeEnquiries.map(async (enquiry) => {
      const slots = await getAvailableSlotsForEnquiry(enquiry.id);
      return {
        enquiry,
        slots,
      };
    })
  );

  const enquiriesWithSlots = enquirySlots.filter((item) => item.slots.length > 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Appointments"
        description="View your scheduled consultations and book available support sessions."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Booked Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-sm text-slate-500">
                No appointments booked yet.
              </p>
            ) : (
              (appointments as AppointmentRow[]).map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-xl border border-slate-200 p-4 text-sm"
                >
                  <p className="font-medium text-slate-900">
                    Appointment #{appointment.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="mt-1 text-slate-500">
                    Enquiry ID: {appointment.enquiry_id}
                  </p>
                  <p className="text-slate-500">
                    Starts: {new Date(appointment.starts_at).toLocaleString()}
                  </p>
                  <p className="text-slate-500">
                    Ends: {new Date(appointment.ends_at).toLocaleString()}
                  </p>
                  <p className="text-slate-500">
                    Status: {appointment.status}
                  </p>
                  <p className="text-slate-500">
                    Notes: {appointment.notes ?? "—"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Available Consultation Slots</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {enquiriesWithSlots.length === 0 ? (
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  No available slots are currently open for your active enquiries.
                </p>
                {activeEnquiries.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-slate-500">
                      Your active enquiries exist, but no support officer slots have been made available yet.
                    </p>
                    {activeEnquiries.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <p className="font-medium text-slate-900">{item.subject}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.enquiryCode} • {item.status}
                        </p>
                        <Button asChild variant="outline" size="sm" className="mt-3">
                          <Link href={`/student/enquiries/${item.id}`}>
                            View enquiry
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">
                    You do not currently have any active enquiries eligible for booking.
                  </p>
                )}
              </div>
            ) : (
              enquiriesWithSlots.map(({ enquiry, slots }) => (
                <div key={enquiry.id} className="space-y-4 rounded-xl border border-slate-200 p-4">
                  <div>
                    <p className="font-medium text-slate-900">{enquiry.subject}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {enquiry.enquiryCode} • {enquiry.status}
                    </p>
                  </div>

                  <BookEnquirySlotForm
                    enquiryId={enquiry.id}
                    slots={slots as any[]}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
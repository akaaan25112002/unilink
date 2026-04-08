import { PageHeader } from "@/components/layout/page-header";
import { BookingForm } from "@/components/forms/booking-form";
import { getSlots } from "@/features/appointments/queries";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const slots = await getSlots(token);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <PageHeader
        title="Book Appointment"
        description="Choose an available timeslot for your consultation."
      />

      {slots.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500 shadow-sm">
          No available slots found for this booking link, or the link may have expired.
        </div>
      ) : (
        <BookingForm
          token={token}
          slots={slots.map((slot: any) => ({
            id: slot.slot_id,
            label: `${new Date(slot.starts_at).toLocaleString()} - ${new Date(
              slot.ends_at
            ).toLocaleTimeString()}`,
          }))}
        />
      )}
    </main>
  );
}
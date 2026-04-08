"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { CalendarDays, Clock3, MapPin } from "lucide-react";

import { bookAppointmentForEnquiry } from "@/features/appointments/actions";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SlotItem = {
  slot_id: string;
  officer_id: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  meeting_mode: string | null;
  notes: string | null;
};

type Props = {
  enquiryId: string;
  slots: SlotItem[];
};

export function BookEnquirySlotForm({ enquiryId, slots }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [notes, setNotes] = useState("");

  const groupedDates = useMemo(() => {
    const dates = Array.from(
      new Set(slots.map((slot) => new Date(slot.starts_at).toISOString().slice(0, 10)))
    );
    return dates.sort();
  }, [slots]);

  const filteredSlots = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter(
      (slot) =>
        new Date(slot.starts_at).toISOString().slice(0, 10) === selectedDate
    );
  }, [slots, selectedDate]);

  const handleBook = () => {
    if (!selectedSlotId) {
      toast.error("Please select a slot.");
      return;
    }

    startTransition(() => {
      void (async () => {
        const result = await bookAppointmentForEnquiry({
          enquiryId,
          slotId: selectedSlotId,
          notes,
        });

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
      })();
    });
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Consultation Booking
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {groupedDates.length === 0 ? (
          <p className="text-sm text-slate-500">
            No consultation slots are currently available for this enquiry.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Select a date</Label>
              <div className="flex flex-wrap gap-2">
                {groupedDates.map((date) => {
                  const active = selectedDate === date;
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlotId("");
                      }}
                      className={`rounded-xl border px-4 py-2 text-sm transition ${
                        active
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {new Date(date).toLocaleDateString()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Available time slots</Label>

              {!selectedDate ? (
                <p className="text-sm text-slate-500">
                  Please choose a date first.
                </p>
              ) : filteredSlots.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No slots available for the selected date.
                </p>
              ) : (
                filteredSlots.map((slot) => {
                  const active = selectedSlotId === slot.slot_id;
                  return (
                    <button
                      key={slot.slot_id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.slot_id)}
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-medium text-slate-900">
                          <Clock3 className="mr-2 inline h-4 w-4" />
                          {new Date(slot.starts_at).toLocaleTimeString()} -{" "}
                          {new Date(slot.ends_at).toLocaleTimeString()}
                        </p>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                          {slot.meeting_mode ?? "Consultation"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        <MapPin className="mr-1 inline h-4 w-4" />
                        {slot.location ?? "Location not specified"}
                      </p>

                      {slot.notes ? (
                        <p className="mt-1 text-sm text-slate-500">
                          Notes: {slot.notes}
                        </p>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment-notes">Notes</Label>
              <Textarea
                id="appointment-notes"
                rows={3}
                placeholder="Optional note for the consultation"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button onClick={handleBook} disabled={isPending || !selectedSlotId}>
              {isPending ? "Booking..." : "Book Appointment"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
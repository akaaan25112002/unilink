"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { bookAppointment } from "@/features/appointments/actions";
import {
  bookingSchema,
  type BookingValues,
} from "@/features/appointments/schemas";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BookingFormProps = {
  token: string;
  slots: { id: string; label: string }[];
};

export function BookingForm({ token, slots }: BookingFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      slot: "",
      notes: "",
    },
  });

  const onSubmit = (values: BookingValues) => {
    startTransition(() => {
      void (async () => {
        const result = await bookAppointment({
          token,
          slotId: values.slot,
          notes: values.notes,
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label>Available Timeslot</Label>
        <Select
          value={form.watch("slot")}
          onValueChange={(value: string) =>
            form.setValue("slot", value, { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a timeslot" />
          </SelectTrigger>
          <SelectContent>
            {slots.map((slot) => (
              <SelectItem key={slot.id} value={slot.id}>
                {slot.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.slot ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.slot.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={4} {...form.register("notes")} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Booking..." : "Confirm Booking"}
      </Button>
    </form>
  );
}
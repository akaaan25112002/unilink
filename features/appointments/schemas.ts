import { z } from "zod";

export const bookingSchema = z.object({
  slot: z.string().min(1, "Please select a timeslot."),
  notes: z.string().max(1000, "Notes are too long.").optional(),
});

export type BookingValues = z.infer<typeof bookingSchema>;
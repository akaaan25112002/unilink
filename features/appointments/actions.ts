"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Officer creates manual availability slots
 */
export async function createAppointmentSlot(input: {
  startsAt: string;
  endsAt: string;
  location?: string;
  meetingMode?: string;
  notes?: string;
}) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "You must be logged in.",
    };
  }

  const { error } = await supabase.from("appointment_slots").insert({
    officer_id: user.id,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    location: input.location ?? null,
    meeting_mode: input.meetingMode ?? null,
    notes: input.notes ?? null,
    source: "MANUAL",
    is_booked: false,
  });

  if (error) {
    console.error("createAppointmentSlot error:", error);
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath("/officer/appointments");

  return {
    ok: true,
    message: "Availability slot created successfully.",
  };
}

/**
 * NEW FLOW:
 * Student books directly from enquiry detail page
 */
export async function bookAppointmentForEnquiry(input: {
  enquiryId: string;
  slotId: string;
  notes?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("book_appointment_for_enquiry", {
    p_enquiry_id: input.enquiryId,
    p_slot_id: input.slotId,
    p_notes: input.notes ?? null,
  });

  if (error) {
    console.error("bookAppointmentForEnquiry error:", error);
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath("/student/appointments");
  revalidatePath(`/student/enquiries/${input.enquiryId}`);
  revalidatePath("/officer/appointments");
  revalidatePath("/officer/enquiries");

  return {
    ok: true,
    appointmentId: data as string,
    message: "Appointment booked successfully.",
  };
}

/**
 * LEGACY FLOW:
 * Officer generates booking token link
 * Keep this exported so older UI files still compile.
 */
export async function createBookingToken(enquiryId: string) {
  const supabase = await createClient();

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase.rpc("create_booking_token", {
    p_enquiry_id: enquiryId,
    p_expires_at: expiresAt,
  });

  if (error) {
    console.error("createBookingToken error:", error);
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath(`/officer/enquiries/${enquiryId}`);

  return {
    ok: true,
    token: data as string,
    message: "Booking link created successfully.",
  };
}

/**
 * LEGACY FLOW:
 * Student books through token page
 * Keep this exported so old booking-form.tsx still compiles.
 */
export async function bookAppointment(input: {
  token: string;
  slotId: string;
  notes?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("book_appointment_with_token", {
    p_token: input.token,
    p_slot_id: input.slotId,
    p_notes: input.notes ?? null,
  });

  if (error) {
    console.error("bookAppointment error:", error);
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath("/student/appointments");
  revalidatePath("/officer/appointments");

  return {
    ok: true,
    appointmentId: data as string,
    message: "Appointment booked successfully.",
  };
}
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * NEW FLOW:
 * Student sees available slots directly from enquiry detail
 */
export async function getAvailableSlotsForEnquiry(enquiryId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_available_slots_for_enquiry",
    {
      p_enquiry_id: enquiryId,
    }
  );

  if (error) {
    console.error("getAvailableSlotsForEnquiry error:", error);
    return [];
  }

  return data ?? [];
}

/**
 * LEGACY FLOW:
 * Student opens /booking/[token]
 * Keep this so old booking page still compiles.
 */
export async function getSlots(token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_available_slots_for_token",
    {
      p_token: token,
    }
  );

  if (error) {
    console.error("getSlots error:", error);
    return [];
  }

  return data ?? [];
}

export async function getStudentAppointments() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      enquiry_id,
      starts_at,
      ends_at,
      status,
      notes
    `)
    .eq("student_id", user.id)
    .order("starts_at", { ascending: true });

  if (error || !data) {
    console.error("getStudentAppointments error:", error);
    return [];
  }

  return data;
}

export async function getOfficerAppointments() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      enquiry_id,
      student_id,
      starts_at,
      ends_at,
      status,
      notes
    `)
    .eq("officer_id", user.id)
    .order("starts_at", { ascending: true });

  if (error || !data) {
    console.error("getOfficerAppointments error:", error);
    return [];
  }

  return data;
}

export async function getOfficerSlots() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("appointment_slots")
    .select(`
      id,
      starts_at,
      ends_at,
      location,
      meeting_mode,
      notes,
      is_booked
    `)
    .eq("officer_id", user.id)
    .order("starts_at", { ascending: true });

  if (error || !data) {
    console.error("getOfficerSlots error:", error);
    return [];
  }

  return data;
}
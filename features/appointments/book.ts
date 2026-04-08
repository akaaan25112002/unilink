"use server";

import { createClient } from "@/lib/supabase/server";

export async function bookAppointment(token: string, slotId: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc(
    "book_appointment_with_token",
    {
      p_token: token,
      p_slot_id: slotId,
    }
  );

  if (error) return { ok: false, message: error.message };

  return { ok: true };
}
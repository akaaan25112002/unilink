import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select(`
      id,
      title,
      body,
      created_at,
      is_read,
      related_enquiry_id,
      related_appointment_id,
      type
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      items: data ?? [],
    },
    { status: 200 }
  );
}
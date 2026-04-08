"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEnquiry(values: {
  subject: string;
  description: string;
  category: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("create_enquiry", {
    p_subject: values.subject,
    p_description: values.description,
    p_category: values.category,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/student/enquiries");

  return { ok: true, message: "Created successfully" };
}
"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitFeedback(values: {
  enquiryId: string;
  rating: number;
  satisfaction: string;
  comment?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("submit_feedback", {
    p_enquiry_id: values.enquiryId,
    p_rating: values.rating,
    p_satisfaction: values.satisfaction,
    p_comment: values.comment ?? null,
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  return {
    ok: true,
    feedbackId: data as string,
  };
}
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type EnquiryWorkflowStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "ESCALATED"
  | "CLOSED";

export async function updateEnquiryStatusAsOfficer(input: {
  enquiryId: string;
  newStatus: EnquiryWorkflowStatus;
  publicMessage?: string;
  internalNote?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("update_enquiry_status", {
    p_enquiry_id: input.enquiryId,
    p_new_status: input.newStatus,
    p_public_message: input.publicMessage ?? null,
    p_internal_note: input.internalNote ?? null,
  });

  if (error) {
    console.error("updateEnquiryStatusAsOfficer error:", error);
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath("/officer");
  revalidatePath("/officer/enquiries");
  revalidatePath(`/officer/enquiries/${input.enquiryId}`);

  return {
    ok: true,
    message: "Case updated successfully.",
  };
}
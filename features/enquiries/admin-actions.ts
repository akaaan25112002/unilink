"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function assignEnquiry(
  enquiryId: string,
  officerId: string,
  note?: string
) {
  const supabase = await createClient();

  const { error } = await supabase.rpc("assign_enquiry", {
    p_enquiry_id: enquiryId,
    p_support_officer_id: officerId,
    p_note: note ?? null,
  });

  if (error) {
    console.error("assignEnquiry error:", error);
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${enquiryId}`);

  return {
    ok: true,
    message: "Enquiry assigned successfully.",
  };
}

export async function updateEnquiryStatusAsAdmin(input: {
  enquiryId: string;
  newStatus:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "RESOLVED"
    | "ESCALATED"
    | "CLOSED"
    | "IN_PROGRESS"
    | "ASSIGNED";
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
    console.error("updateEnquiryStatusAsAdmin error:", error);
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${input.enquiryId}`);

  return {
    ok: true,
    message: "Enquiry status updated successfully.",
  };
}
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type AppRole =
  | "STUDENT"
  | "ADMIN_OFFICER"
  | "SUPPORT_OFFICER"
  | "MANAGER"
  | "IT_SUPPORT";

export async function updateUserProfile(input: {
  userId: string;
  fullName: string;
  role: AppRole;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName,
      role: input.role,
    })
    .eq("id", input.userId);

  if (error) {
    console.error("updateUserProfile error:", error);
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath("/it");
  revalidatePath("/it/users");
  revalidatePath("/admin");
  revalidatePath("/officer");
  revalidatePath("/manager");

  return {
    ok: true,
    message: "User profile updated successfully.",
  };
}
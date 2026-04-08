"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "You must be logged in.",
    };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("markNotificationRead error:", error);
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath("/student");
  revalidatePath("/student/enquiries");
  revalidatePath("/student/appointments");
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath("/officer");
  revalidatePath("/officer/enquiries");
  revalidatePath("/officer/appointments");
  revalidatePath("/manager");
  revalidatePath("/manager/escalations");
  revalidatePath("/manager/reports");
  revalidatePath("/it");
  revalidatePath("/it/users");

  return {
    ok: true,
    message: "Notification marked as read.",
  };
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "You must be logged in.",
    };
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    console.error("markAllNotificationsRead error:", error);
    return {
      ok: false,
      message: error.message,
    };
  }

  revalidatePath("/student");
  revalidatePath("/admin");
  revalidatePath("/officer");
  revalidatePath("/manager");
  revalidatePath("/it");

  return {
    ok: true,
    message: "All notifications marked as read.",
  };
}
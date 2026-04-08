import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import type { AppNotification } from "@/features/notifications/types";

type NotificationRow = {
  id: string;
  title: string;
  body: string | null;
  created_at: string;
  is_read: boolean;
  related_enquiry_id: string | null;
  related_appointment_id: string | null;
  type: string;
};

function mapNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    isRead: row.is_read,
    relatedEnquiryId: row.related_enquiry_id,
    relatedAppointmentId: row.related_appointment_id,
    type: row.type,
  };
}

export async function getNotifications(): Promise<AppNotification[]> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return [];

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
    .limit(15);

  if (error || !data) {
    console.error("getNotifications error:", error);
    return [];
  }

  return (data as NotificationRow[]).map(mapNotification);
}

export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return 0;

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    console.error("getUnreadNotificationCount error:", error);
    return 0;
  }

  return count ?? 0;
}
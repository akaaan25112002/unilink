import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import type { Enquiry } from "@/types/enquiry";
import type { DbEnquiryRow } from "@/features/enquiries/types";

function mapEnquiry(row: DbEnquiryRow, studentName: string): Enquiry {
  return {
    id: row.id,
    enquiryCode: row.enquiry_code ?? `ENQ-${row.id.slice(0, 8).toUpperCase()}`,
    studentId: row.student_id,
    studentName,
    subject: row.subject,
    description: row.description,
    category: row.category,
    aiSuggestedCategory: row.ai_suggested_category,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assignedOfficerId: row.assigned_officer_id,
  };
}

export async function getStudentEnquiries(): Promise<Enquiry[]> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("enquiries")
    .select(`
      id,
      enquiry_code,
      subject,
      description,
      category,
      ai_suggested_category,
      status,
      priority,
      created_at,
      updated_at,
      student_id,
      assigned_officer_id
    `)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("getStudentEnquiries error:", error);
    return [];
  }

  return (data as DbEnquiryRow[]).map((row) => mapEnquiry(row, user.fullName));
}

export async function getStudentEnquiryById(id: string): Promise<Enquiry | null> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("enquiries")
    .select(`
      id,
      enquiry_code,
      subject,
      description,
      category,
      ai_suggested_category,
      status,
      priority,
      created_at,
      updated_at,
      student_id,
      assigned_officer_id
    `)
    .eq("id", id)
    .eq("student_id", user.id)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("getStudentEnquiryById error:", error);
    }
    return null;
  }

  return mapEnquiry(data as DbEnquiryRow, user.fullName);
}
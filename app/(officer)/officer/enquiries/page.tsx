import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { EnquiryTable } from "@/components/enquiries/enquiry-table";
import type { Enquiry } from "@/types/enquiry";

type OfficerDbEnquiryRow = {
  id: string;
  enquiry_code: string | null;
  subject: string;
  description: string;
  category: Enquiry["category"];
  ai_suggested_category: Enquiry["aiSuggestedCategory"];
  status: Enquiry["status"];
  priority: Enquiry["priority"];
  created_at: string;
  updated_at: string;
  student_id: string;
  assigned_officer_id: string | null;
  profiles: { full_name: string | null }[] | null;
};

function mapOfficerEnquiry(row: OfficerDbEnquiryRow): Enquiry {
  return {
    id: row.id,
    enquiryCode: row.enquiry_code ?? `ENQ-${row.id.slice(0, 8).toUpperCase()}`,
    studentId: row.student_id,
    studentName: row.profiles?.[0]?.full_name ?? "Student",
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

async function getOfficerEnquiries(): Promise<Enquiry[]> {
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
      assigned_officer_id,
      profiles:student_id (
        full_name
      )
    `)
    .eq("assigned_officer_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("getOfficerEnquiries error:", error);
    return [];
  }

  return (data as OfficerDbEnquiryRow[]).map(mapOfficerEnquiry);
}

export default async function OfficerEnquiriesPage() {
  const enquiries = await getOfficerEnquiries();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assigned Enquiries"
        description="View and manage all enquiries assigned to you."
      />

      {enquiries.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-sm text-slate-500">
          No assigned enquiries found.
        </div>
      ) : (
        <EnquiryTable items={enquiries} basePath="/officer/enquiries" />
      )}
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { EnquiryTable } from "@/components/enquiries/enquiry-table";
import type { Enquiry } from "@/types/enquiry";

type AdminDbEnquiryRow = {
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

function mapAdminEnquiry(row: AdminDbEnquiryRow): Enquiry {
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

async function getAdminEnquiries(): Promise<Enquiry[]> {
  const supabase = await createClient();

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
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("getAdminEnquiries error:", error);
    return [];
  }

  return (data as AdminDbEnquiryRow[]).map(mapAdminEnquiry);
}

export default async function AdminEnquiriesPage() {
  const enquiries = await getAdminEnquiries();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incoming Enquiries"
        description="Review, triage, and assign student enquiries."
      />

      {enquiries.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-sm text-slate-500">
          No pending enquiries found.
        </div>
      ) : (
        <EnquiryTable items={enquiries} basePath="/admin/enquiries" />
      )}
    </div>
  );
}
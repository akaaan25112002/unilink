import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { EnquiryDetailCard } from "@/components/enquiries/enquiry-detail-card";
import { CommunicationTimeline } from "@/components/enquiries/communication-timeline";
import { StatusUpdateForm } from "@/components/forms/status-update-form";
import { createClient } from "@/lib/supabase/server";
import type { Enquiry, CommunicationEntry } from "@/types/enquiry";

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

async function getOfficerEnquiryById(id: string): Promise<Enquiry | null> {
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
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getOfficerEnquiryById error:", error);
    return null;
  }

  return mapOfficerEnquiry(data as OfficerDbEnquiryRow);
}

async function getCommunicationHistory(enquiryId: string): Promise<CommunicationEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enquiry_messages")
    .select(`
      id,
      enquiry_id,
      author_user_id,
      visibility,
      message,
      created_at,
      profiles:author_user_id (
        full_name,
        role
      )
    `)
    .eq("enquiry_id", enquiryId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    if (error) console.error("getCommunicationHistory error:", error);
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    enquiryId: row.enquiry_id,
    authorName: row.profiles?.[0]?.full_name ?? row.profiles?.full_name ?? "Unknown User",
    authorRole: row.profiles?.[0]?.role ?? row.profiles?.role ?? "UNKNOWN",
    message: row.message,
    isInternal: row.visibility === "INTERNAL",
    createdAt: row.created_at,
  }));
}

export default async function OfficerEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [enquiry, messages] = await Promise.all([
    getOfficerEnquiryById(id),
    getCommunicationHistory(id),
  ]);

  if (!enquiry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Case Management"
        description="Update status, record communication, and make consultation slots available for the student."
      />

      <EnquiryDetailCard enquiry={enquiry} />
      <StatusUpdateForm enquiryId={enquiry.id} defaultStatus={enquiry.status} />
      <CommunicationTimeline items={messages} />
    </div>
  );
}
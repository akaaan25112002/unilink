import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { EnquiryDetailCard } from "@/components/enquiries/enquiry-detail-card";
import { AssignmentForm } from "@/components/forms/assignment-form";
import { AdminStatusForm } from "@/components/forms/admin-status-form";
import {
  TraceabilityTimeline,
  type TraceabilityItem,
} from "@/components/enquiries/traceability-timeline";
import { CommunicationTimeline } from "@/components/enquiries/communication-timeline";
import { getSupportOfficers } from "@/features/users/queries";
import type { Enquiry, CommunicationEntry } from "@/types/enquiry";

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

async function getAdminEnquiryById(id: string): Promise<Enquiry | null> {
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
    if (error) console.error("getAdminEnquiryById error:", error);
    return null;
  }

  return mapAdminEnquiry(data as AdminDbEnquiryRow);
}

async function getAdminCommunicationHistory(
  enquiryId: string
): Promise<CommunicationEntry[]> {
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
    if (error) console.error("getAdminCommunicationHistory error:", error);
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

async function getTraceabilityEvents(enquiryId: string): Promise<TraceabilityItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("enquiry_events")
    .select(`
      id,
      event_type,
      note,
      created_at,
      profiles:actor_user_id (
        full_name
      )
    `)
    .eq("enquiry_id", enquiryId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("getTraceabilityEvents error:", error);
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    eventType: row.event_type,
    note: row.note,
    createdAt: row.created_at,
    actorName: row.profiles?.[0]?.full_name ?? row.profiles?.full_name ?? null,
  }));
}

export default async function AdminEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [enquiry, officers, traceabilityItems, messages] = await Promise.all([
    getAdminEnquiryById(id),
    getSupportOfficers(),
    getTraceabilityEvents(id),
    getAdminCommunicationHistory(id),
  ]);

  if (!enquiry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review and Triage"
        description="Review details, update status, assign ownership, and inspect traceability."
      />

      <EnquiryDetailCard enquiry={enquiry} />

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminStatusForm
          enquiryId={enquiry.id}
          defaultStatus={enquiry.status}
        />

        <AssignmentForm
          enquiryId={enquiry.id}
          officers={officers}
          currentAssignedOfficerId={enquiry.assignedOfficerId}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CommunicationTimeline items={messages} />
        <TraceabilityTimeline items={traceabilityItems} />
      </div>
    </div>
  );
}
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { EnquiryDetailCard } from "@/components/enquiries/enquiry-detail-card";
import { CommunicationTimeline } from "@/components/enquiries/communication-timeline";
import { BookEnquirySlotForm } from "@/components/forms/book-enquiry-slot-form";
import { getStudentEnquiryById } from "@/features/enquiries/queries";
import { getAvailableSlotsForEnquiry } from "@/features/appointments/queries";
import { createClient } from "@/lib/supabase/server";
import type { CommunicationEntry } from "@/types/enquiry";

async function getStudentCommunicationHistory(
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
    .eq("visibility", "PUBLIC")
    .order("created_at", { ascending: true });

  if (error || !data) {
    if (error) console.error("getStudentCommunicationHistory error:", error);
    return [];
  }

  return data.map((row: any) => ({
    id: row.id,
    enquiryId: row.enquiry_id,
    authorName: row.profiles?.[0]?.full_name ?? row.profiles?.full_name ?? "Staff",
    authorRole: row.profiles?.[0]?.role ?? row.profiles?.role ?? "STAFF",
    message: row.message,
    isInternal: false,
    createdAt: row.created_at,
  }));
}

export default async function StudentEnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [enquiry, availableSlots, messages] = await Promise.all([
    getStudentEnquiryById(id),
    getAvailableSlotsForEnquiry(id),
    getStudentCommunicationHistory(id),
  ]);

  if (!enquiry) {
    notFound();
  }

  const canBook = ["ASSIGNED", "IN_PROGRESS", "UNDER_REVIEW", "ESCALATED"].includes(
    enquiry.status
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiry Detail"
        description="Review status, follow-up information, and consultation availability."
      />

      <EnquiryDetailCard enquiry={enquiry} />

      {canBook ? (
        <BookEnquirySlotForm enquiryId={enquiry.id} slots={availableSlots as any[]} />
      ) : null}

      <CommunicationTimeline items={messages} />
    </div>
  );
}
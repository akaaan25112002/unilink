import { PageHeader } from "@/components/layout/page-header";
import { FeedbackForm } from "@/components/forms/feedback-form";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ enquiryId: string }>;
}) {
  const { enquiryId } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submit Feedback"
        description="Share your experience after your enquiry is resolved."
      />
      <FeedbackForm enquiryId={enquiryId} />
    </div>
  );
}
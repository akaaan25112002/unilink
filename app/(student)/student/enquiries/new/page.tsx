import { PageHeader } from "@/components/layout/page-header";
import { EnquiryForm } from "@/components/forms/enquiry-form";

export default function NewEnquiryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Submit Enquiry"
        description="Create a new student enquiry."
      />
      <EnquiryForm />
    </div>
  );
}
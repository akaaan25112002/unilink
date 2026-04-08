import { PageHeader } from "@/components/layout/page-header";
import { EnquiryTable } from "@/components/enquiries/enquiry-table";
import { getStudentEnquiries } from "@/features/enquiries/queries";

export default async function StudentEnquiriesPage() {
  const enquiries = await getStudentEnquiries();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Enquiries"
        description="Track all enquiries you have submitted."
      />

      {enquiries.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          No enquiries found.
        </div>
      ) : (
        <EnquiryTable items={enquiries} basePath="/student/enquiries" />
      )}
    </div>
  );
}
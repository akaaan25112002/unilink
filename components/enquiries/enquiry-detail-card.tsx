import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/enquiries/status-badge";
import { PriorityBadge } from "@/components/enquiries/priority-badge";
import type { Enquiry } from "@/types/enquiry";

export function EnquiryDetailCard({ enquiry }: { enquiry: Enquiry }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{enquiry.subject}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={enquiry.status} />
          <PriorityBadge priority={enquiry.priority} />
        </div>
        <div className="grid gap-2 text-sm">
          <p><span className="font-medium">Enquiry Code:</span> {enquiry.enquiryCode}</p>
          <p><span className="font-medium">Student:</span> {enquiry.studentName}</p>
          <p><span className="font-medium">Category:</span> {enquiry.category}</p>
          <p><span className="font-medium">Description:</span> {enquiry.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
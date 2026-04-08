import { Badge } from "@/components/ui/badge";
import type { EnquiryStatus } from "@/lib/constants/statuses";

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return <Badge variant="secondary">{status.replaceAll("_", " ")}</Badge>;
}
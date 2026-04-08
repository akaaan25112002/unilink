import { Badge } from "@/components/ui/badge";
import type { EnquiryPriority } from "@/lib/constants/priorities";

export function PriorityBadge({ priority }: { priority: EnquiryPriority }) {
  return <Badge>{priority}</Badge>;
}
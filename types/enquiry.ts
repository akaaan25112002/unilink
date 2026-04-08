import type { EnquiryPriority } from "@/lib/constants/priorities";
import type { EnquiryStatus } from "@/lib/constants/statuses";

export type EnquiryCategory =
  | "ACADEMIC"
  | "FINANCIAL"
  | "WELFARE"
  | "VISA"
  | "GRADUATION"
  | "OTHER";

export type Enquiry = {
  id: string;
  enquiryCode: string;
  studentId: string;
  studentName: string;
  subject: string;
  description: string;
  category: EnquiryCategory;
  aiSuggestedCategory?: EnquiryCategory | null;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  createdAt: string;
  updatedAt: string;
  assignedOfficerId?: string | null;
};

export type CommunicationEntry = {
  id: string;
  enquiryId: string;
  authorName: string;
  authorRole: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
};
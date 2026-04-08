export type CreateEnquiryResult = {
  ok: boolean;
  message: string;
};

export type DbEnquiryRow = {
  id: string;
  enquiry_code: string | null;
  subject: string;
  description: string;
  category: "ACADEMIC" | "FINANCIAL" | "WELFARE" | "VISA" | "GRADUATION" | "OTHER";
  ai_suggested_category:
    | "ACADEMIC"
    | "FINANCIAL"
    | "WELFARE"
    | "VISA"
    | "GRADUATION"
    | "OTHER"
    | null;
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "ESCALATED"
    | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  created_at: string;
  updated_at: string;
  student_id: string;
  assigned_officer_id: string | null;
};
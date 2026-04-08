export const ENQUIRY_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "ESCALATED",
  "CLOSED",
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
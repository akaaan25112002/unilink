export const ENQUIRY_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export type EnquiryPriority = (typeof ENQUIRY_PRIORITIES)[number];
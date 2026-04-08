import { z } from "zod";

export const enquirySchema = z.object({
  subject: z.string().min(3, "Subject is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(["ACADEMIC", "FINANCIAL", "WELFARE", "VISA", "GRADUATION", "OTHER"]),
});

export type EnquiryValues = z.infer<typeof enquirySchema>;
import { z } from "zod";

export const feedbackSchema = z.object({
  rating: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Rating is required."
          : "Rating must be a number.",
    })
    .min(1, { error: "Rating must be at least 1." })
    .max(5, { error: "Rating cannot be greater than 5." }),
  satisfaction: z.enum(
    ["VERY_SATISFIED", "SATISFIED", "NEUTRAL", "DISSATISFIED"],
    {
      error: "Please select a satisfaction level.",
    }
  ),
  comment: z.string().max(1000, { error: "Comment is too long." }).optional(),
});

export type FeedbackValues = z.infer<typeof feedbackSchema>;
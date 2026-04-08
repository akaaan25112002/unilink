export type Feedback = {
  id: string;
  enquiryId: string;
  studentId: string;
  rating: number;
  satisfaction: "VERY_SATISFIED" | "SATISFIED" | "NEUTRAL" | "DISSATISFIED";
  comment?: string | null;
  createdAt: string;
};
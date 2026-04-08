export type Appointment = {
  id: string;
  enquiryId: string;
  officerId: string;
  studentId: string;
  startsAt: string;
  endsAt: string;
  notes?: string | null;
  status: "PENDING" | "BOOKED" | "CANCELLED" | "COMPLETED";
};
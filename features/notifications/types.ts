export type AppNotification = {
  id: string;
  title: string;
  body: string | null;
  createdAt: string;
  isRead: boolean;
  relatedEnquiryId: string | null;
  relatedAppointmentId: string | null;
  type: string;
};
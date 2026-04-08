export const ROUTES = {
  home: "/",
  login: "/login",
  booking: "/booking",

  student: {
    root: "/student",
    enquiries: "/student/enquiries",
    newEnquiry: "/student/enquiries/new",
    appointments: "/student/appointments",
    feedback: "/student/feedback",
  },

  admin: {
    root: "/admin",
    enquiries: "/admin/enquiries",
  },

  officer: {
    root: "/officer",
    enquiries: "/officer/enquiries",
    appointments: "/officer/appointments",
  },

  manager: {
    root: "/manager",
    escalations: "/manager/escalations",
    reports: "/manager/reports",
  },

  it: {
    root: "/it",
    users: "/it/users",
  },
} as const;
import { z } from "zod";

export const userRoleSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["STUDENT", "ADMIN_OFFICER", "SUPPORT_OFFICER", "MANAGER", "IT_SUPPORT"]),
});

export type UserRoleValues = z.infer<typeof userRoleSchema>;
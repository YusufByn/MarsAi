import { z } from 'zod';

export const juryRegisterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().trim().min(2, "First name is too short"),
  lastName: z.string().trim().min(2, "Last name is too short"),
  role: z.enum(['user', 'admin']).optional()
});

export const juryLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(1, "Password required")
});
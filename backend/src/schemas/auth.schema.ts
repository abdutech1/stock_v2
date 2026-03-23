import { z } from "zod";

export const registerOwnerSchema = z.object({
  name: z.string().min(2),
  phoneNumber: z.string().min(9),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  phoneNumber: z.string(),
  password: z.string(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6),
});

export const resetEmployeePasswordSchema = z.object({
  employeeId: z.number({ 
    message: "Employee ID must be a valid number" 
  }).int().positive(),
});

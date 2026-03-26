import { z } from "zod";

// The "Big Three": Organization, Admin User, and Slug
export const signupSchema = z.object({
  body: z.object({
    // Organization Data
    name: z.string().min(2, "Organization name is too short"),
    slug: z
      .string()
      .min(2)
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/, "Slugs must be URL-friendly (letters, numbers, and dashes only)"),
    
    // Admin User Data
    userName: z.string().min(2, "User name is too short"),
    phoneNumber: z.string().min(9, "Valid phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const switchBranchSchema = z.object({
  body: z.object({
    branchId: z.number().int().positive(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    phoneNumber: z.string().min(1, "Phone number is required"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  }),
});

export const resetEmployeePasswordSchema = z.object({
  body: z.object({
    employeeId: z.number({ 
      message: "Employee ID must be a valid number" 
    }).int().positive(),
  }),
});
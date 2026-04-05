import { z } from "zod";
import { BranchRole } from "@prisma/client";

export const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    
    phoneNumber: z.string().min(9, "Invalid phone number"),
    
    branchRole: z.nativeEnum(BranchRole),

    branchId: z.number({ message: "Branch ID is required" })
      .int()
      .positive("A valid branch ID must be assigned"),
      
    baseSalary: z.number().nonnegative().optional(),
  }),
});

export const updateEmployeeSchema = z.object({
  body: createEmployeeSchema.shape.body.partial(),
});


export const transferEmployeeSchema = z.object({
  body: z.object({
    // Using z.coerce.number() without the options object
    newBranchId: z.coerce.number()
      .int()
      .positive("Valid Branch ID is required"),
    
    newRole: z.nativeEnum(BranchRole),

    reason: z.string().max(255).optional(),
  }),
});
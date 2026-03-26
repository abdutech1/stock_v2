import { z } from "zod";
import { BranchRole } from "@prisma/client";

export const createEmployeeSchema = z.object({
  body: z.object({
    // Method-based messaging: pass the string as the second argument
    name: z.string().min(2, "Name must be at least 2 characters"),
    
    phoneNumber: z.string().min(9, "Invalid phone number"),

    // In v4, if the options object is failing, 
    // simply define the enum and use .refine for the custom message
    branchRole: z.nativeEnum(BranchRole).refine((val) => !!val, {
      message: "Please select a valid branch role (MANAGER, CASHIER, etc.)"
    }),

    // Move the error message into the .min() or .positive() method
    branchId: z.number().positive("A branch must be assigned"),

    baseSalary: z.number().nonnegative().optional(),
  }),
});

export const updateEmployeeSchema = z.object({
  body: createEmployeeSchema.shape.body.partial(),
});


/**
 * TRANSFER EMPLOYEE
 * Used to move an employee to a different branch
 */
export const transferEmployeeSchema = z.object({
  body: z.object({
    newBranchId: z.coerce.number({ 
      message: "Branch ID is required and must be a number" 
    })
    .int()
    .positive(),

    reason: z.string().max(255).optional(),
  }),
});
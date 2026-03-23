import { z } from "zod";
import { UserRole } from "../generated/prisma/enums.js";

export const createEmployeeSchema = z.object({
  name: z.string().min(2),
  phoneNumber: z.string().min(9),
  baseSalary: z.number().nonnegative().optional(),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();
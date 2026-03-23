import { z } from "zod";

export const salaryPreviewSchema = z.object({
  userId: z.coerce.number().int().positive("User ID is required"),
  rate: z.coerce.number().positive("Rate must be greater than 0"),
  
  periodStart: z.coerce.date({ message: "Start date is required or invalid" }),
  
  periodEnd: z.coerce.date({ message: "End date is required or invalid" }),
})
.refine((data) => data.periodEnd >= data.periodStart, {
  message: "End date cannot be before start date",
  path: ["periodEnd"],
});
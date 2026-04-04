import { z } from "zod";

export const DashboardFilterSchema = z.object({
  params: z.object({
    branchId: z.string().regex(/^\d+$/, "Branch ID must be a number").transform(Number),
  }),
  query: z.object({
    startDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
    endDate: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  }).refine((data) => {
    if (data.startDate && data.endDate) return data.startDate <= data.endDate;
    return true;
  }, { message: "Start date cannot be after end date", path: ["startDate"] }),
});
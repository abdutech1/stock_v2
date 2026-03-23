import { z } from "zod";

const dateRangeShape = {
  periodStart: z.coerce.date({ message: "Invalid start date" }),
  periodEnd: z.coerce.date({ message: "Invalid end date" }),
};

export const createSalarySchema = z.object({
  userId: z.coerce.number().int().positive("User ID is required"),
  rate: z.coerce.number().positive("Rate must be greater than 0"),
  ...dateRangeShape,
})
// 1. Check: Order of dates
.refine((data) => data.periodEnd >= data.periodStart, {
  message: "End date cannot be before start date",
  path: ["periodEnd"],
})
// 2. Check: No future payments
.refine((data) => data.periodEnd <= new Date(), {
  message: "Cannot pay salary for future dates",
  path: ["periodEnd"],
});

export const salaryReportQuerySchema = z.object(dateRangeShape)
  .partial()
  .refine((data) => {
    if (data.periodStart && data.periodEnd) {
      return data.periodEnd > data.periodStart;
    }
    return true;
  }, {
    message: "End date must be after start date",
    path: ["periodEnd"],
  });


export const salaryIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Invalid salary ID"),
});

export const updateSalarySchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
  rate: z.coerce.number().positive().optional(),
  periodStart: z.coerce.date().optional(),
  periodEnd: z.coerce.date().optional(),
})
.refine((data) => {
  if (data.periodStart && data.periodEnd) {
    return data.periodEnd >= data.periodStart;
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["periodEnd"],
})
.refine((data) => {
  if (data.periodEnd) {
    return data.periodEnd <= new Date();
  }
  return true;
}, {
  message: "Cannot pay salary for future dates",
  path: ["periodEnd"],
});
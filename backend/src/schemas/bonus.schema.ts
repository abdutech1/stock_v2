import { z } from "zod";

const dateRangeBase = z.object({
  periodStart: z.coerce.date({ message: "Invalid start date" }),
  periodEnd: z.coerce.date({ message: "Invalid end date" }),
});

export const applyBonusSchema = z.discriminatedUnion("mode", [
  dateRangeBase.extend({
    mode: z.literal("GLOBAL"),
    globalAmount: z.coerce.number().positive().optional(),
  }),
  dateRangeBase.extend({
    mode: z.literal("RULE_BASED"),
  }),
]).refine((data) => data.periodEnd >= data.periodStart, {
  message: "End date cannot be before start date",
  path: ["periodEnd"],
});
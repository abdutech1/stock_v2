import { z } from "zod";

const BonusTypeEnum = z.enum(["PERIOD_TOTAL", "SINGLE_SALE", "GLOBAL"]);

export const createBonusRuleSchema = z.object({
  type: BonusTypeEnum,
  minAmount: z.coerce.number().min(0).optional(),
  bonusAmount: z.coerce.number().positive("Bonus amount must be greater than 0"),
})
.refine((data) => {
  if (data.type !== "GLOBAL") {
    return data.minAmount !== undefined && data.minAmount > 0;
  }
  return true;
}, {
  message: "minAmount is required and must be greater than 0 for rule-based bonuses",
  path: ["minAmount"],
});

export const bonusRuleIdParamSchema = z.object({
  id: z.coerce.number().int().positive("Invalid ID format"),
});
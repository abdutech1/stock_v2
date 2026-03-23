import { Request, Response } from "express";
import { z } from "zod";
import {
  createBonusRule,
  getActiveBonusRules,
  deactivateBonusRule,
} from "../../services/bonusRule.service.js";
import { createBonusRuleSchema, bonusRuleIdParamSchema } from "../../schemas/bonusRule.schema.js";

export async function createBonusRuleController(req: Request, res: Response) {
  try {
    const validatedData = createBonusRuleSchema.parse(req.body);

    const rule = await createBonusRule(validatedData);
    res.status(201).json(rule);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    res.status(400).json({ message: error.message });
  }
}

export async function getActiveBonusRulesController(_: Request, res: Response) {
  try {
    const rules = await getActiveBonusRules();
    res.json(rules);
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deactivateBonusRuleController(req: Request, res: Response) {
  try {
    const { id } = bonusRuleIdParamSchema.parse(req.params);
    const result = await deactivateBonusRule(id);
    
    res.json({
      success: true,
      message: "Bonus rule deactivated successfully",
      rule: result
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    res.status(400).json({ message: error.message });
  }
}
import prisma from "../prismaClient.js";
import { bonus_type } from "@/generated/prisma/enums.js";

export interface CreateBonusRuleInput {
  type: "PERIOD_TOTAL" | "SINGLE_SALE" | "GLOBAL";
  minAmount?: number; 
  bonusAmount: number;
}




export async function createBonusRule(data: CreateBonusRuleInput) {
  const minAmount = data.type === "GLOBAL" ? 0 : (data.minAmount ?? 0);

  const existingAnyStatus = await prisma.bonusRule.findFirst({
    where: { type: data.type, minAmount }
  });

  if (existingAnyStatus) {
    if (existingAnyStatus.isActive) {
      throw new Error(`An active ${data.type} bonus rule already exists`);
    }

    return prisma.bonusRule.update({
      where: { id: existingAnyStatus.id },
      data: { 
        isActive: true, 
        bonusAmount: data.bonusAmount 
      },
    });
  }

  return prisma.bonusRule.create({
    data: {
      type: data.type,
      minAmount,
      bonusAmount: data.bonusAmount,
      isActive: true
    },
  });
}



export async function getActiveBonusRules() {
  return prisma.bonusRule.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function deactivateBonusRule(id: number) {
  const existing = await prisma.bonusRule.findUnique({ where: { id } });
  
  if (!existing) {
    throw new Error(`Bonus rule with ID ${id} not found`);
  }

  return prisma.bonusRule.update({
    where: { id },
    data: { isActive: false },
  });
}

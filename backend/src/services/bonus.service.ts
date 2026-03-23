import prisma from "../prismaClient.js";
import { bonus_type } from "@/generated/prisma/enums.js";

export async function applyBonusPayment({
  periodStart,
  periodEnd,
  mode,          
  globalAmount, 
}: {
  periodStart: Date;
  periodEnd: Date;
  mode: "RULE_BASED" | "GLOBAL";
  globalAmount?: number;
}) {
  // 1️⃣ Normalize periodEnd to end of day
  periodEnd.setHours(23, 59, 59, 999);

  return prisma.$transaction(async (tx) => {
    // 2️⃣ Prevent duplicate for the same period
    const exists = await tx.bonusPayment.findFirst({
      where: { periodStart, periodEnd },
    });
    if (exists) throw new Error("Bonus already applied for this period");

    // =========================
    // GLOBAL BONUS
    // =========================
    if (mode === "GLOBAL") {
      // Fetch the active GLOBAL rule
      const globalRule = await tx.bonusRule.findFirst({
        where: { type: bonus_type.GLOBAL, isActive: true },
      });

      if (!globalRule) throw new Error("No active GLOBAL bonus rule found");

      const amountToApply = globalAmount ?? globalRule.bonusAmount;
      if (!amountToApply || amountToApply <= 0)
        throw new Error("Global bonus amount must be greater than 0");

      const employees = await tx.user.findMany({
        where: { role: "EMPLOYEE", isActive: true },
        select: { id: true },
      });

      if (!employees.length) throw new Error("No active employees found");

      const data = employees.map((e) => ({
        userId: e.id,
        periodStart,
        periodEnd,
        type: bonus_type.GLOBAL,
        amount: amountToApply,
      }));

      return tx.bonusPayment.createMany({ data });
    }

    // =========================
    // RULE-BASED BONUS
    // =========================
    const rules = await tx.bonusRule.findMany({ where: { isActive: true } });
    if (!rules.length) throw new Error("No active bonus rules configured");

    // Split rules
    const periodRules = rules.filter(r => r.type === bonus_type.PERIOD_TOTAL);
    const singleSaleRules = rules.filter(r => r.type === bonus_type.SINGLE_SALE);

    // Fetch confirmed sales in period
    const sales = await tx.sale.findMany({
      where: {
        status: "CONFIRMED",
        createdAt: { gte: periodStart, lte: periodEnd },
      },
      include: { user: true, items: true },
    });

    // Aggregate sales per employee
    const summary = new Map<number, { totalSales: number; maxSingleSale: number }>();
    for (const sale of sales) {
      if (sale.user.role !== "EMPLOYEE") continue;

      const total = sale.items.reduce((sum, i) => sum + i.quantity * i.soldPrice, 0);

      if (!summary.has(sale.employeeId)) summary.set(sale.employeeId, { totalSales: 0, maxSingleSale: 0 });
      const s = summary.get(sale.employeeId)!;
      s.totalSales += total;
      s.maxSingleSale = Math.max(s.maxSingleSale, total);
    }

    // Calculate bonuses
    const bonusPayments: {
      userId: number;
      periodStart: Date;
      periodEnd: Date;
      type: bonus_type;
      amount: number;
      ruleId?: number;
    }[] = [];

    for (const [userId, s] of summary) {
      // PERIOD_TOTAL bonus
      const bestPeriod = periodRules
        .filter(r => s.totalSales >= r.minAmount)
        .sort((a, b) => b.bonusAmount - a.bonusAmount)[0];

      if (bestPeriod) {
        bonusPayments.push({
          userId,
          periodStart,
          periodEnd,
          type: bonus_type.PERIOD_TOTAL,
          amount: bestPeriod.bonusAmount,
          ruleId: bestPeriod.id,
        });
      }

      // SINGLE_SALE bonus
      const bestSingle = singleSaleRules
        .filter(r => s.maxSingleSale >= r.minAmount)
        .sort((a, b) => b.bonusAmount - a.bonusAmount)[0];

      if (bestSingle) {
        bonusPayments.push({
          userId,
          periodStart,
          periodEnd,
          type: bonus_type.SINGLE_SALE,
          amount: bestSingle.bonusAmount,
          ruleId: bestSingle.id,
        });
      }
    }

    if (!bonusPayments.length) throw new Error("No employees qualified for bonus");

    return tx.bonusPayment.createMany({ data: bonusPayments });
  });
}





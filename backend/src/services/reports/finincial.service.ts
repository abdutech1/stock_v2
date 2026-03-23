// src/services/reports.service.ts
import prisma from "../../prismaClient.js";
import { subDays, startOfDay, endOfDay } from "date-fns";

interface FinancialSummaryQuery {
  startDate?: string | Date;
  endDate?: string | Date;
  groupBy?: "day" | "week" | "month" | "quarter" | "year";
  includeBreakdown?: boolean;   
  includeCOGS?: boolean;        
  includeSalaries?: boolean;
  includeBonuses?: boolean;
  includeExpenses?: boolean;
  page?: number;                
  limit?: number;
}

export async function getFinancialSummaryReport(query: FinancialSummaryQuery = {}) {
  const {
    startDate,
    endDate,
    groupBy = "month",
    includeBreakdown = true,
    includeCOGS = true,
    includeSalaries = true,
    includeBonuses = true,
    includeExpenses = true,
    page = 1,
    limit = 20,
  } = query;

  const from = startDate ? new Date(startDate) : subDays(new Date(), 365);
  const to = endDate ? new Date(endDate) : new Date();
  const start = startOfDay(from);
  const end = endOfDay(to);

  // ── 1. SALES & COGS ───────────────────────────────────────────────
  const confirmedSales = await prisma.sale.findMany({
    where: { status: "CONFIRMED", createdAt: { gte: start, lte: end } },
    include: { items: { include: { pricecategory: { include: { stock: true, category: true } } } }, payments: true },
  });

  let totalRevenue = 0;
  let totalCOGS = 0;
  const salesByCategory = new Map<string, { revenue: number; cogs: number; count: number }>();

  confirmedSales.forEach(sale => {
    sale.items.forEach(item => {
      const revenue = item.quantity * item.soldPrice;
      const cogs = includeCOGS ? item.quantity * (item.pricecategory?.stock?.purchasePrice || 0) : 0;

      totalRevenue += revenue;
      totalCOGS += cogs;

      if (includeBreakdown) {
        const catName = item.pricecategory?.category?.name || "Unknown";
        const current = salesByCategory.get(catName) || { revenue: 0, cogs: 0, count: 0 };
        salesByCategory.set(catName, {
          revenue: current.revenue + revenue,
          cogs: current.cogs + cogs,
          count: current.count + 1,
        });
      }
    });
  });

  const grossProfit = totalRevenue - totalCOGS;

  // ── 2. EXPENSES ───────────────────────────────────────────────────
  let totalExpenses = 0;
  let expensesByCategory: Record<string, number> = {};

  if (includeExpenses) {
    const expenses = await prisma.expense.findMany({ where: { expenseDate: { gte: start, lte: end } } });
    totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    if (includeBreakdown) {
      expensesByCategory = expenses.reduce((acc, e) => {
        const cat = e.category || "Other";
        acc[cat] = (acc[cat] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>);
    }
  }

  
const totalSalaries = includeSalaries
  ? (await prisma.salarypayment.aggregate({ 
      where: { 
        createdAt: { gte: start, lte: end } // Filter by the moment of payment
      }, 
      _sum: { amount: true } 
    }))._sum.amount || 0
  : 0;

const totalBonuses = includeBonuses
  ? (await prisma.bonusPayment.aggregate({ 
      where: { 
        createdAt: { gte: start, lte: end } // Filter by the moment of payment
      }, 
      _sum: { amount: true } 
    }))._sum.amount || 0
  : 0;

  const totalPayroll = totalSalaries + totalBonuses;

  // ── 4. NET PROFIT ─────────────────────────────────────────────────
  const netProfit = grossProfit - totalExpenses - totalPayroll;

  let timeSeries: any[] = [];

  if (groupBy) {
    const months = new Map<string, { revenue: number; expenses: number; grossProfit: number; netProfit: number }>();

    confirmedSales.forEach(sale => {
      const key = sale.createdAt.toISOString().slice(0, 7); // YYYY-MM
      const current = months.get(key) || { revenue: 0, expenses: 0, grossProfit: 0, netProfit: 0 };
      const saleRevenue = sale.items.reduce((sum, i) => sum + i.quantity * i.soldPrice, 0);
      const saleCOGS = includeCOGS ? sale.items.reduce((sum, i) => sum + i.quantity * (i.pricecategory?.stock?.purchasePrice || 0), 0) : 0;
      current.revenue += saleRevenue;
      current.grossProfit += saleRevenue - saleCOGS;
      months.set(key, current);
    });

    if (includeExpenses) {
      const expenses = await prisma.expense.findMany({ where: { expenseDate: { gte: start, lte: end } } });
      expenses.forEach(exp => {
        const key = exp.expenseDate.toISOString().slice(0, 7);
        const current = months.get(key) || { revenue: 0, expenses: 0, grossProfit: 0, netProfit: 0 };
        current.expenses += exp.amount;
        current.netProfit = (current.grossProfit || 0) - current.expenses - totalPayroll / months.size; // rough payroll split
        months.set(key, current);
      });
    }

    timeSeries = Array.from(months.entries()).map(([period, data]) => ({
      period,
      revenue: data.revenue,
      expenses: data.expenses,
      grossProfit: data.grossProfit,
      netProfit: data.netProfit,
      margin: data.revenue > 0 ? ((data.grossProfit / data.revenue) * 100).toFixed(1) + "%" : "N/A",
    })).sort((a, b) => a.period.localeCompare(b.period));
  }

  // ── FINAL RESPONSE ───────────────────────────────────────────────
  return {
    period: { from: start.toISOString().split("T")[0], to: end.toISOString().split("T")[0] },
    summary: {
      totalRevenue,
      costOfGoodsSold: includeCOGS ? totalCOGS : null,
      grossProfit,
      totalExpenses,
      totalPayroll,
      netProfit,
      grossMargin: totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) + "%" : "N/A",
    },
    breakdowns: includeBreakdown
      ? {
          byCategory: Array.from(salesByCategory.entries()).map(([category, data]) => ({
            category,
            revenue: data.revenue,
            cogs: data.cogs,
            profit: data.revenue - data.cogs,
            margin: data.revenue > 0 ? ((data.revenue - data.cogs) / data.revenue * 100).toFixed(1) + "%" : "N/A",
          })),
          expensesByCategory,
        }
      : undefined,
    timeSeries,
  };
}





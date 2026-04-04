// src/services/branch-dashboard.service.ts
import prisma from "@/prismaClient.js";
import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  startOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay 
} from "date-fns";

/**
 * TYPES & INTERFACES
 */
interface DashboardFilters {
  branchId: number;
  startDate?: Date; // Defaults to 7 days ago
  endDate?: Date;   // Defaults to today
}

interface RawTrendResult {
  saleDate: Date;
  revenue: number;
  cogs: number;
}

interface RawInventoryResult {
  lowStockAlerts: number;
  outOfStock: number;
}

/**
 * THE SERVICE
 */
export const getBranchDashboardData = async ({
  branchId,
  startDate,
  endDate,
}: DashboardFilters) => {
  const now = new Date();
  
  // 1. Date Range Normalization
  const effectiveEnd = endDate ? endOfDay(endDate) : endOfDay(now);
  const effectiveStart = startDate 
    ? startOfDay(startDate) 
    : subDays(startOfDay(now), 6); // 7 days including today

  const monthStart = startOfMonth(now);

  // 2. Parallel Data Fetching
  const [
    kpiStats,
    trendRaw,
    inventoryRaw,
    topExpenses,
    topVariantsRaw,
    recentSales
  ] = await Promise.all([
    
    // KPI SUMMARY: Today's performance and Month-to-Date
    prisma.$transaction([
      // Today: Revenue & Transaction Count
      prisma.sale.aggregate({
        where: {
          branchId,
          createdAt: { gte: startOfDay(now), lte: endOfDay(now) },
          status: "COMPLETED"
        },
        _sum: { totalAmount: true },
        _count: { id: true }
      }),
      // MTD: Total Expenses
      prisma.expense.aggregate({
        where: { branchId, createdAt: { gte: monthStart } },
        _sum: { amount: true }
      }),
      // MTD: Total Revenue
      prisma.sale.aggregate({
        where: {
          branchId,
          createdAt: { gte: monthStart },
          status: "COMPLETED"
        },
        _sum: { totalAmount: true }
      }),
      // MTD: Total COGS (Cost of Goods Sold)
      prisma.$queryRaw<[{ totalCOGS: number }]>`
        SELECT COALESCE(SUM(si.quantity * pv.costPrice), 0) as totalCOGS
        FROM Sale s
        JOIN SaleItem si ON s.id = si.saleId
        JOIN ProductVariant pv ON si.productVariantId = pv.id
        WHERE s.branchId = ${branchId}
          AND s.status = 'COMPLETED'
          AND s.createdAt >= ${monthStart}
      `
    ]),

    // TREND DATA: Daily Revenue + Profit
    prisma.$queryRaw<RawTrendResult[]>`
      SELECT 
        DATE(s.createdAt) as saleDate,
        COALESCE(SUM(s.totalAmount), 0) as revenue,
        COALESCE(SUM(si.quantity * pv.costPrice), 0) as cogs
      FROM Sale s
      JOIN SaleItem si ON s.id = si.saleId
      JOIN ProductVariant pv ON si.productVariantId = pv.id
      WHERE s.branchId = ${branchId}
        AND s.status = 'COMPLETED'
        AND s.createdAt >= ${effectiveStart}
        AND s.createdAt <= ${effectiveEnd}
      GROUP BY DATE(s.createdAt)
      ORDER BY saleDate ASC
    `,

    // INVENTORY: Health Check
    prisma.$queryRaw<RawInventoryResult[]>`
      SELECT 
        COUNT(CASE WHEN quantity <= minStockLevel AND quantity > 0 THEN 1 END) as lowStockAlerts,
        COUNT(CASE WHEN quantity = 0 THEN 1 END) as outOfStock
      FROM Stock
      WHERE branchId = ${branchId}
    `,

    // EXPENSES: Top 5 of the month
    prisma.expense.findMany({
      where: { branchId, createdAt: { gte: monthStart } },
      select: { description: true, amount: true, createdAt: true },
      take: 5,
      orderBy: { amount: "desc" }
    }),

    // TOP PRODUCTS: Best sellers in the selected range
    prisma.saleItem.groupBy({
      by: ["productVariantId"],
      where: {
        sale: { 
          branchId, 
          status: "COMPLETED",
          createdAt: { gte: effectiveStart, lte: effectiveEnd }
        }
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5
    }).then(async (groups) => {
      if (groups.length === 0) return [];
      const variants = await prisma.productVariant.findMany({
        where: { id: { in: groups.map(g => g.productVariantId) } },
        select: { id: true, name: true, product: { select: { name: true } } }
      });
      return groups.map(g => {
        const v = variants.find(v => v.id === g.productVariantId);
        return {
          name: `${v?.product.name} (${v?.name})`,
          quantity: Number(g._sum.quantity || 0)
        };
      });
    }),

    // RECENT ACTIVITY: Sales feed
    prisma.sale.findMany({
      where: { branchId, status: { not: "DRAFT" } },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true } },
        user: { select: { name: true } },
      }
    })
  ]);

  // 3. KPI CALCULATIONS
  const todayRev = Number(kpiStats[0]._sum.totalAmount || 0);
  const mtdRev = Number(kpiStats[2]._sum.totalAmount || 0);
  const mtdExp = Number(kpiStats[1]._sum.amount || 0);
  const mtdCOGS = Number(kpiStats[3][0]?.totalCOGS || 0);
  const mtdGrossProfit = mtdRev - mtdCOGS;

  // 4. CHART GAP-FILLING LOGIC
  // Ensures every day in the interval exists in the chart, even with 0 revenue
  const allDays = eachDayOfInterval({ start: effectiveStart, end: effectiveEnd });
  const formattedTrend = allDays.map(day => {
    const match = trendRaw.find(r => isSameDay(new Date(r.saleDate), day));
    const revenue = match ? Number(match.revenue) : 0;
    const cogs = match ? Number(match.cogs) : 0;
    const profit = revenue - cogs;
    
    return {
      date: format(day, 'MMM dd'),
      revenue,
      grossProfit: Number(profit.toFixed(2)),
      grossMargin: revenue > 0 ? Number(((profit / revenue) * 100).toFixed(2)) : 0
    };
  });

  // 5. FINAL RESPONSE MAPPING
  return {
    kpis: {
      today: {
        revenue: todayRev,
        transactions: kpiStats[0]._count.id || 0
      },
      month: {
        revenue: mtdRev,
        expenses: mtdExp,
        grossProfit: Number(mtdGrossProfit.toFixed(2)),
        grossMargin: mtdRev > 0 ? Number(((mtdGrossProfit / mtdRev) * 100).toFixed(2)) : 0,
        netProfit: Number((mtdGrossProfit - mtdExp).toFixed(2))
      }
    },
    inventory: {
      lowStock: Number(inventoryRaw[0]?.lowStockAlerts || 0),
      outOfStock: Number(inventoryRaw[0]?.outOfStock || 0)
    },
    charts: {
      revenueTrend: formattedTrend,
      topProducts: topVariantsRaw
    },
    recentSales,
    topExpenses
  };
};
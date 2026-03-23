import prisma from "../../prismaClient.js";
import { Prisma } from "../../generated/prisma/client.js";
import { subDays } from "date-fns";

interface InventoryReportQuery {
  categoryId?: number;
  priceCategoryId?: number;
  lowStockThreshold?: number;
  highStockThreshold?: number;
  includeHistory?: boolean;
  includeValuation?: boolean;
  includeTurnover?: boolean;
  startDate?: string | Date;
  endDate?: string | Date;
  page?: number;
  limit?: number;
  sortBy?: "quantity" | "purchaseValue" | "fixedValue";
  sortOrder?: "asc" | "desc";
}

export async function getInventoryReport(query: InventoryReportQuery = {}) {
  const {
    categoryId,
    priceCategoryId,
    lowStockThreshold = 3,
    highStockThreshold = 1000,
    includeHistory = false,
    includeValuation = true,
    includeTurnover = false,
    startDate,
    endDate,
    page = 1,
    limit = 50,
    sortBy = "quantity",
    sortOrder = "asc",
  } = query;

  const from = startDate ? new Date(startDate) : subDays(new Date(), 90);
  const to = endDate ? new Date(endDate) : new Date();

  const where: Prisma.pricecategoryWhereInput = {
    isActive: true,
    ...(categoryId && { categoryId }),
    ...(priceCategoryId && { id: priceCategoryId }),
  };

  const skip = (page - 1) * limit;

  // =========================
  // Fetch base inventory data
  // =========================
  const priceCategories = await prisma.pricecategory.findMany({
    where,
    include: {
      category: { select: { id: true, name: true, imageUrl: true } },
      stock: true,
    },
    skip,
    take: limit,
  });

  // =========================
  // Turnover data (aggregated)
  // =========================
  let soldMap = new Map<number, number>();

  if (includeTurnover) {
    const sold = await prisma.saleItem.groupBy({
      by: ["priceCategoryId"],
      where: {
        sale: {
          status: "CONFIRMED",
          createdAt: { gte: from, lte: to },
        },
      },
      _sum: { quantity: true },
    });

    sold.forEach(s =>
      soldMap.set(s.priceCategoryId, s._sum.quantity ?? 0)
    );
  }

  // =========================
  // Enrichment
  // =========================
  const items = priceCategories.map(pc => {
    const quantity = pc.stock?.quantity ?? 0;
    const purchasePrice = pc.stock?.purchasePrice ?? 0;
    const fixedPrice = pc.fixedPrice;

    const purchaseValue = quantity * purchasePrice;
    const fixedValue = quantity * fixedPrice;

    const totalSold = soldMap.get(pc.id) ?? 0;
    const avgStock = quantity + totalSold / 2; 
    const turnoverRate =
      includeTurnover && avgStock > 0 ? totalSold / avgStock : 0;

 


    return {
      priceCategoryId: pc.id,
      category: pc.category,
      fixedPrice,
      imageUrl: pc.imageUrl,
      stock: {
        quantity,
        purchasePrice,
        createdAt: pc.stock?.createdAt,
        updatedAt: pc.stock?.updatedAt,
      },
      valuation: includeValuation
        ? {
            purchaseValue,
            fixedValue,
            potentialProfit: fixedValue - purchaseValue,
          }
        : undefined,
      alerts: {
        lowStock: quantity < lowStockThreshold,
        highStock: quantity >= highStockThreshold,
      },
      turnover: includeTurnover
        ? {
            rate: Number(turnoverRate.toFixed(2)),
            totalSoldInPeriod: totalSold,
            periodDays: Math.ceil(
              (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
            ),
          }
        : undefined,
    };
  });

  

  // =========================
  // Sorting (computed fields)
  // =========================
  items.sort((a, b) => {
    const dir = sortOrder === "desc" ? -1 : 1;
    if (sortBy === "quantity") return dir * (a.stock.quantity - b.stock.quantity);
    if (sortBy === "purchaseValue")
      return dir * ((a.valuation?.purchaseValue ?? 0) - (b.valuation?.purchaseValue ?? 0));
    if (sortBy === "fixedValue")
      return dir * ((a.valuation?.fixedValue ?? 0) - (b.valuation?.fixedValue ?? 0));
    return 0;
  });

  // =========================
  // History (optional)
  // =========================
  let history;
  if (includeHistory) {
    history = await prisma.saleItem.findMany({
      where: {
        priceCategoryId: { in: priceCategories.map(pc => pc.id) },
        sale: {
          status: "CONFIRMED",
          createdAt: { gte: from, lte: to },
        },
      },
      include: {
        sale: { select: { id: true, createdAt: true } },
      },
      orderBy: { sale: { createdAt: "desc" } },
    });
  }

  // =========================
  // Summary
  // =========================
 const summary = {
  totalSKUs: items.length,
  totalQuantity: items.reduce((s, i) => s + i.stock.quantity, 0),
  totalPurchaseValue: items.reduce((s, i) => s + (i.valuation?.purchaseValue ?? 0), 0),
  totalFixedValue: items.reduce((s, i) => s + (i.valuation?.fixedValue ?? 0), 0),

  // ── Changed logic ──────────────────────────────────────
  lowStockProducts: new Set(
    items
      .filter(i => i.alerts.lowStock)
      .map(i => i.category.id)           // group by category
  ).size,

  lowStockVariants: items.filter(i => i.alerts.lowStock).length, 
};




  return {
    pagination: {
      page,
      limit,
      total: await prisma.pricecategory.count({ where }),
    },
    summary,
    items,
    history,
  };
}



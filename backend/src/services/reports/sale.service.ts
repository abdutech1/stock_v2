// src/services/reports.service.ts
import prisma from "../../prismaClient.js";
import { PrismaClient } from '@prisma/client'; 
import {calculateRevenue} from '../../utils/calculateRevenue.js'

import { subDays, 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  startOfMonth, 
  startOfYear, 
  format } from "date-fns";

interface SalesReportQuery {
  startDate?: string | Date;          // ISO string or Date
  endDate?: string | Date;
  groupBy?: "day" | "week" | "month" | "quarter" | "year"; // grouping level
  categoryId?: number;
  priceCategoryId?: number;
  employeeId?: number;
  status?: "DRAFT" | "CONFIRMED" | "CANCELLED";
  paymentMethod?: "CASH" | "BANK";
  includeTopItems?: number;           // e.g. top 10 best-selling items
  includePaymentBreakdown?: boolean;
  includeTrends?: boolean;            // MoM / YoY growth
  page?: number;
  limit?: number;
  sortBy?: string;                    // e.g. "totalRevenue:desc"
}

export async function getSalesReport(query: SalesReportQuery = {}) {
  const {
    startDate,
    endDate,
    groupBy = "day",
    categoryId,
    priceCategoryId,
    employeeId,
    //status = "CONFIRMED",  default to confirmed sales
    status,
    paymentMethod,
    includeTopItems = 0,
    includePaymentBreakdown = false,
    includeTrends = false,
    page = 1,
    limit = 20,
    sortBy = "createdAt:desc",
  } = query;

  // Date range handling
  const from = startDate ? new Date(startDate) : subDays(new Date(), 30);
  const to = endDate ? new Date(endDate) : new Date();

  const start = startOfDay(from);
  const end = endOfDay(to);

  // Build base where clause
  const where: Prisma.SaleWhereInput = {
    createdAt: { gte: start, lte: end },
    // status,
    ...(status && { status }),
    ...(employeeId && { employeeId }),
    ...(priceCategoryId && {
      items: { some: { priceCategoryId } },
    }),
    ...(categoryId && {
      items: {
        some: {
          pricecategory: { categoryId },
        },
      },
    }),
    ...(paymentMethod && {
      payments: { some: { method: paymentMethod } },
    }),
  };

  // Pagination & sorting
  const [sortField, sortOrder] = sortBy.split(":");
  const validSortFields = ["createdAt", "status", "id"]; 
const field = validSortFields.includes(sortField) ? sortField : "createdAt";

const orderBy: Prisma.SaleOrderByWithRelationInput = {
  [field]: (sortOrder === "desc" ? "desc" : "asc") as Prisma.SortOrder
};


const skip = (page - 1) * limit;
  // === Main sales data ===
  const sales = await prisma.sale.findMany({
    where,
    include: {
      user: { select: { id: true, name: true } },
      items: {
        include: {
          pricecategory: {
            include: { category: { select: { id: true, name: true } } },
          },
        },
      },
      payments: true,
    },
    orderBy,
    skip,
    take: limit,
  });

  // === Aggregations ===
  const revenueItems = await prisma.saleItem.findMany({
  where: { sale: where },
  select: {
    quantity: true,
    soldPrice: true,
  },
});

const totalRevenue = calculateRevenue(revenueItems);
const totalItemsSold = revenueItems.reduce(
  (sum, i) => sum + i.quantity,
  0
);


  const totalPayments = await prisma.salePayment.aggregate({
    where: { sale: where },
    _sum: { amount: true },
  });

  // Payment breakdown (if requested)
  let paymentBreakdown: any = null;
  if (includePaymentBreakdown) {
    paymentBreakdown = await prisma.salePayment.groupBy({
      by: ["method"],
      where: { sale: where },
      _sum: { amount: true },
      _count: true,
    });
  }

 // Top selling items (if requested)
let topItems: any[] = [];
if (includeTopItems > 0) {
  // 1. Get the aggregated data (IDs and Sums only)
 const groupedItems = await prisma.saleItem.groupBy({
  by: ["priceCategoryId"],
  where: { sale: where },
  _sum: { quantity: true },
});


  if (groupedItems.length > 0) {
    // 2. Fetch the display details for these specific priceCategory IDs
    const itemDetails = await prisma.saleItem.findMany({
  where: {
    priceCategoryId: {
      in: groupedItems.map(g => g.priceCategoryId),
    },
    sale: where,
  },
  select: {
    priceCategoryId: true,
    quantity: true,
    soldPrice: true,
  },
});


    // 3. Merge the details back into your aggregated data
    topItems = groupedItems.map(group => {
  const items = itemDetails.filter(
    i => i.priceCategoryId === group.priceCategoryId
  );

  return {
    priceCategoryId: group.priceCategoryId,
    totalQuantity: group._sum.quantity || 0,
    totalRevenue: calculateRevenue(items),
  };
});
  }
}

 
 // === Grouped data (time series) ===
let groupedData: any[] = [];
if (groupBy) {
  groupedData = aggregateByPeriod(sales, groupBy, start, end);
}

  // === Trends (MoM / YoY) ===
  let trends = null;
  if (includeTrends) {
    trends = await calculateTrends(start, end, groupBy, where);
  }

  // Format individual sales (like your getTodaySalesForOwner)
  const formattedSales = sales.map((sale) => {
    const itemsTotal = sale.items.reduce((sum, i) => sum + i.quantity * i.soldPrice, 0);
    const paymentsTotal = sale.payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      saleId: sale.id,
      employee: { id: sale.user.id, name: sale.user.name },
      status: sale.status,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
      itemsTotal,
      paymentsTotal,
      items: sale.items.map((i) => ({
        categoryName: i.pricecategory.category.name,
        priceCategoryId: i.priceCategoryId,
        quantity: i.quantity,
        soldPrice: i.soldPrice,
      })),
      payments: sale.payments.map((p) => ({
        method: p.method,
        amount: p.amount,
        bankName: p.bankName,
      })),
    };
  });

  return {
    pagination: {
      page,
      limit,
      total: await prisma.sale.count({ where }),
    },
    summary: {
  totalRevenue,
  totalItemsSold,
  totalPayments: totalPayments._sum.amount || 0,
  salesCount: formattedSales.length,
},
    paymentBreakdown,
    topItems,
    groupedData,
    trends,
    sales: formattedSales,
  };
}

// Helper: Aggregate grouped data by period (day/week/month/quarter/year)
function aggregateByPeriod(records: any[], groupBy: string, start: Date, end: Date) {
  const groups: Record<string, { period: string; count: number; revenue: number }> = {};

  records.forEach((sale) => {
    const date = new Date(sale.createdAt);
    let groupKey: string;

    switch (groupBy) {
      case "week":
        groupKey = format(startOfWeek(date), "yyyy-MM-dd");
        break;
      case "month":
        groupKey = format(startOfMonth(date), "yyyy-MM");
        break; // Added missing break
      case "year":
        groupKey = format(startOfYear(date), "yyyy");
        break;
      case "day":
      default:
        groupKey = format(startOfDay(date), "yyyy-MM-dd");
        break;
    }

    if (!groups[groupKey]) {
      groups[groupKey] = { period: groupKey, count: 0, revenue: 0 };
    }

    groups[groupKey].count += 1;

    // Calculate revenue for this specific sale
    const saleRevenue = sale.items?.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.soldPrice);
    }, 0) || 0;

    groups[groupKey].revenue += saleRevenue;
  });

  return Object.values(groups).sort((a, b) => a.period.localeCompare(b.period));
}

// Helper: Calculate MoM / YoY trends
async function calculateTrends(start: Date, end: Date, groupBy: string, where: Prisma.SaleWhereInput) {
  const daysInPeriod = getPeriodDays(groupBy);
  
  // Calculate the previous period dates
  const prevStart = subDays(start, daysInPeriod);
  const prevEnd = subDays(end, daysInPeriod);

  // 1. Get current revenue (we could pass this in, but let's calculate for accuracy)
  const currentItems = await prisma.saleItem.findMany({
  where: { sale: where },
  select: { quantity: true, soldPrice: true },
});

  // 2. Get previous period revenue
  // We clone the 'where' but swap the dates
  const prevWhere = { 
    ...where, 
    createdAt: { gte: prevStart, lte: prevEnd } 
  };

  const previousItems = await prisma.saleItem.findMany({
  where: { sale: prevWhere },
  select: { quantity: true, soldPrice: true },
});

  const current = calculateRevenue(currentItems);
const previous = calculateRevenue(previousItems);

  // 3. Calculate percentage growth
  let growth = 0;
  if (previous > 0) {
    growth = ((current - previous) / previous) * 100;
  } else if (current > 0) {
    growth = 100; // 100% growth if there were no sales before
  }

  return { 
    current, 
    previous, 
    growth: parseFloat(growth.toFixed(2)) // Round to 2 decimal places
  };
}

function getPeriodDays(period: string): number {
  switch (period) {
    case "day": return 1;
    case "week": return 7;
    case "month": return 30;
    case "quarter": return 90;
    case "year": return 365;
    default: return 30;
  }
}
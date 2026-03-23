import prisma from '../../prismaClient.js';
import { Prisma } from '@/generated/prisma/client.js';
import {buildOrderBy, buildExpenseWhere} from '../../utils/expenseReport.js'
import { subDays, startOfDay, endOfDay } from "date-fns";



export interface ExpenseReportQuery {
  startDate?: string | Date;
  endDate?: string | Date;
  groupBy?: "day" | "week" | "month" | "quarter" | "year";
  category?: string;                 
  minAmount?: number;
  maxAmount?: number;
  includeTrends?: boolean;            
  includeTopCategories?: number;      
  page?: number;
  limit?: number;
  sortBy?: string;                    
}


async function getExpenseSummary(where: Prisma.expenseWhereInput) {
  const agg = await prisma.expense.aggregate({
    where,
    _sum: { amount: true },
    _avg: { amount: true },
    _count: true,
  });

  return {
    totalExpenses: agg._sum.amount ?? 0,
    averageExpense: Number((agg._avg.amount ?? 0).toFixed(2)),
    expenseCount: agg._count,
  };
}


async function getExpenseList(
  where: Prisma.expenseWhereInput,
  orderBy: any,
  page: number,
  limit: number
) {
  const skip = (page - 1) * limit;

  const [items, total] = await prisma.$transaction([
    prisma.expense.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.expense.count({ where }),
  ]);

  return {
    items: items.map(e => ({
      id: e.id,
      description: e.description,
      amount: e.amount,
      category: e.category ?? "Other",
      expenseDate: e.expenseDate.toISOString().slice(0, 10),
      createdAt: e.createdAt.toISOString(),
    })),
    total,
  };
}




async function getExpenseGroupedByPeriod(
  where: Prisma.expenseWhereInput,
  groupBy: "day" | "week" | "month" | "quarter" | "year"
) {
  if (!groupBy) return [];

  const dateFilter = where.expenseDate as Prisma.DateTimeFilter;

  if (!dateFilter || !dateFilter.gte || !dateFilter.lte) {
    throw new Error("Date range (gte and lte) must be provided.");
  }

  return prisma.$queryRaw<any[]>`
    SELECT
      DATE_TRUNC(${groupBy}, "expenseDate") AS period,
      SUM(amount) AS "totalAmount",
      COUNT(*) AS count
    FROM "Expense"
    WHERE "expenseDate" BETWEEN ${dateFilter.gte} AND ${dateFilter.lte}
    GROUP BY period
    ORDER BY period ASC
  `;
}


async function getTopExpenseCategories(
  where: Prisma.expenseWhereInput,
  limit: number
) {
  if (limit <= 0) return [];

  return prisma.expense.groupBy({
    by: ["category"],
    where,
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: "desc" } },
    take: limit,
  });
}



async function getExpenseTrends(
  start: Date,
  end: Date,
  groupBy: NonNullable<ExpenseReportQuery["groupBy"]>,
  baseWhere: Prisma.expenseWhereInput
) {
  const prevStart = new Date(start);
  const prevEnd = new Date(start);

  switch (groupBy) {
    case "month":
      prevStart.setMonth(prevStart.getMonth() - 1);
      break;
    case "week":
      prevStart.setDate(prevStart.getDate() - 7);
      break;
    case "year":
      prevStart.setFullYear(prevStart.getFullYear() - 1);
      break;
  }

  const [current, previous] = await Promise.all([
    prisma.expense.aggregate({
      where: baseWhere,
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: {
        ...baseWhere,
        expenseDate: { gte: prevStart, lte: prevEnd },
      },
      _sum: { amount: true },
    }),
  ]);

  const curr = current._sum.amount ?? 0;
  const prev = previous._sum.amount ?? 0;

  return {
    currentPeriodTotal: curr,
    previousPeriodTotal: prev,
    growthPercentage: prev > 0 ? Number((((curr - prev) / prev) * 100).toFixed(1)) : null,
  };
}


export async function getExpenseReport(query: ExpenseReportQuery = {}) {
  const from = query.startDate ? new Date(query.startDate) : subDays(new Date(), 365);
  const to = query.endDate ? new Date(query.endDate) : new Date();

  const start = startOfDay(from);
  const end = endOfDay(to);

  const where = buildExpenseWhere(start, end, query);
  const orderBy = buildOrderBy(query.sortBy);

  const summary = await getExpenseSummary(where);
  const list = await getExpenseList(where, orderBy, query.page ?? 1, query.limit ?? 50);
  const groupedData = query.groupBy 
    ? await getExpenseGroupedByPeriod(where, query.groupBy)
    : [];
  const topCategories = await getTopExpenseCategories(where, query.includeTopCategories ?? 0);

  const trends =
    query.includeTrends && query.groupBy
      ? await getExpenseTrends(start, end, query.groupBy, where)
      : null;

  return {
    pagination: {
      page: query.page ?? 1,
      limit: query.limit ?? 50,
      total: list.total,
    },
    summary,
    groupedData,
    topCategories,
    trends,
    expenses: list.items,
  };
}



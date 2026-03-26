import { PrismaClient } from '@prisma/client';

const ALLOWED_SORT_FIELDS = ["expenseDate", "amount", "createdAt"];
interface ExpenseReportQuery {
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

export function buildOrderBy(sortBy?: string) {
  if (!sortBy) return { expenseDate: "desc" };

  const [field, order] = sortBy.split(":");
  if (!ALLOWED_SORT_FIELDS.includes(field)) {
    return { expenseDate: "desc" };
  }

  return { [field]: order === "asc" ? "asc" : "desc" };
}

export function buildExpenseWhere(
  start: Date,
  end: Date,
  query: ExpenseReportQuery
): Prisma.expenseWhereInput {
  return {
    expenseDate: { gte: start, lte: end },
    ...(query.category && { category: query.category }),
    ...(query.minAmount !== undefined || query.maxAmount !== undefined
      ? {
          amount: {
            ...(query.minAmount !== undefined && { gte: query.minAmount }),
            ...(query.maxAmount !== undefined && { lte: query.maxAmount }),
          },
        }
      : {}),
  };
}

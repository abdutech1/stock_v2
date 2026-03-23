import { z } from 'zod';

export const salesReportQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  groupBy: z.enum(["day", "week", "month", "year"]).default("day"),
  status: z.enum(["DRAFT", "CONFIRMED", "CANCELLED"]).optional(),
  paymentMethod: z.enum(["CASH", "BANK", "MOBILE"]).optional(),

  categoryId: z.coerce.number().int().positive().optional(),
  priceCategoryId: z.coerce.number().int().positive().optional(),
  employeeId: z.coerce.number().int().positive().optional(),

  includeTopItems: z.coerce.number().int().min(0).default(0),
  includePaymentBreakdown: z.preprocess((val) => val === "true", z.boolean()).default(false),
  includeTrends: z.preprocess((val) => val === "true", z.boolean()).default(false),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().default("createdAt:desc"),
  format: z.enum(["json", "csv"]).optional().default("json"),
})
.refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

// INVERTORY


export const inventoryReportQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  priceCategoryId: z.coerce.number().int().positive().optional(),

  lowStockThreshold: z.coerce.number().int().min(0).default(10),
  highStockThreshold: z.coerce.number().int().min(0).default(1000),

  includeHistory: z.preprocess((val) => val === "true", z.boolean()).default(false),
  includeTurnover: z.preprocess((val) => val === "true", z.boolean()).default(false),
  includeValuation: z.preprocess((val) => val !== "false", z.boolean()).default(true),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),

  sortBy: z.enum(["quantity", "purchaseValue", "fixedValue"]).default("quantity"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  
  format: z.enum(["json", "csv"]).optional().default("json"),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

// EMPLOYEE Performance



export const employeePerformanceQuerySchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
  role: z.enum(["OWNER", "EMPLOYEE"]).optional(),
  isActive: z.preprocess((val) => val !== "false", z.boolean()).default(true),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  groupBy: z.enum(["day", "week", "month", "year"]).optional(),

  includeAttendance: z.preprocess((val) => val !== "false", z.boolean()).default(true),
  includeBonuses: z.preprocess((val) => val !== "false", z.boolean()).default(true),
  includeSalaries: z.preprocess((val) => val !== "false", z.boolean()).default(true),
  includeSales: z.preprocess((val) => val !== "false", z.boolean()).default(true),
  includeComparisons: z.preprocess((val) => val !== "false", z.boolean()).default(true),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().default("performanceScore:desc"),
})
.refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

// Financial Report 

export const financialSummaryQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  groupBy: z.enum(["day", "week", "month", "year"]).optional(),

  includeBreakdown: z.preprocess((val) => val !== "false", z.boolean()).default(true),
  includeCOGS: z.preprocess((val) => val !== "false", z.boolean()).default(true),
  includeSalaries: z.preprocess((val) => val !== "false", z.boolean()).default(true),
  includeBonuses: z.preprocess((val) => val !== "false", z.boolean()).default(true),
  includeExpenses: z.preprocess((val) => val !== "false", z.boolean()).default(true),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})
.refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

// Expense Report

export const expenseReportQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  
  groupBy: z.enum(["day", "week", "month", "quarter", "year"]).optional(),
  category: z.string().optional(),

  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().min(0).optional(),

  includeTrends: z.preprocess((val) => val === "true", z.boolean()).default(false),
  includeTopCategories: z.coerce.number().int().min(0).default(0),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),

  sortBy: z.string().optional(),
  format: z.enum(["json", "csv", "excel"]).optional().default("json"),
})
.refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});

// DASHBOARD SCHEMA

export const dashboardSummaryQuerySchema = z.object({
  period: z.enum(["today", "thisWeek", "thisMonth", "thisYear", "custom"]).optional(),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  lowStockThreshold: z.coerce.number().int().min(0).optional(),
})
.refine((data) => {
  if (data.period === "custom") {
    return !!data.startDate && !!data.endDate;
  }
  return true;
}, {
  message: "Start and End dates are required when period is set to 'custom'",
  path: ["startDate"],
})
.refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: "End date cannot be before start date",
  path: ["endDate"],
});
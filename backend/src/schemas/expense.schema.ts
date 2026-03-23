import { z } from "zod";

/* =========================
   CREATE EXPENSE
   ========================= */
export const createExpenseSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(255),

  amount: z
    .number()
    .positive("Amount must be greater than 0"),

  category: z
    .string()
    .min(1, "Category is required")
    .max(100),

  expenseDate: z.coerce.date().optional(),
});

/* =========================
   UPDATE EXPENSE
   ========================= */
export const updateExpenseSchema = z.object({
  description: z.string().min(1).max(255).optional(),
  amount: z.number().positive().optional(),
  category: z.string().min(1).max(100).optional(),
  expenseDate: z.coerce.date().optional(),
});

/* =========================
   LIST EXPENSES (QUERY)
   ========================= */
export const listExpensesQuerySchema = z.object({
  // This will now accept "2026-01-25" without erroring
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

/* =========================
   ID PARAM
   ========================= */
export const expenseIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
import { z } from "zod";

export const registerStockSchema = z.object({
  priceCategoryId: z.number().int().positive(),
  purchasePrice: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const updateStockSchema = z.object({
  purchasePrice: z.number().positive().optional(),
  quantity: z.number().int().nonnegative().optional(),
});
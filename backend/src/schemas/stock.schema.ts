import { z } from "zod";

export const registerStockSchema = z.object({
  body: z.object({
    productVariantId: z.number().int().positive(),
    branchId: z.number().int().positive(),
    costPrice: z.number().positive(),
    quantity: z.number().int().positive(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateStockSchema = z.object({
  params: z.object({
    variantId: z.string().regex(/^\d+$/).transform(Number),
    branchId: z.string().regex(/^\d+$/).transform(Number),
  }),
  body: z.object({
    costPrice: z.number().positive().optional(),
    quantity: z.number().int().nonnegative().optional(),
  }),
  query: z.object({}).optional(),
});
import { z } from "zod";


export const priceCategoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const categoryIdParamSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
});


export const createPriceCategorySchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  fixedPrice: z.coerce
    .number()
    .positive("Fixed price must be greater than 0"),
});


export const updatePriceCategorySchema = z.object({
  fixedPrice: z.coerce
    .number()
    .positive("Fixed price must be greater than 0")
    .optional(),
});

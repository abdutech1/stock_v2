import { z } from "zod";


export const categoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});


export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name is too long"),
});


export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .optional(),
});


export const getCategoriesQuerySchema = z.object({
  isActive: z.coerce.boolean().optional(),
});

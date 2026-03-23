import { z } from "zod";


export const saleIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});


export const createSaleSchema = z.object({});


export const addSaleItemSchema = z.object({
  saleId: z.coerce.number().int().positive(),
  priceCategoryId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  soldPrice: z.coerce.number().min(0),
});


export const paymentMethodEnum = z.enum(["CASH", "BANK"]);

export const addSalePaymentSchema = z.object({
  saleId: z.coerce.number().int().positive(),
  method: paymentMethodEnum,
  amount: z.coerce.number().positive(),
  bankName: z
    .string()
    .trim()
    .min(2)
    .optional(),
}).refine(
  (data) => data.method !== "BANK" || !!data.bankName,
  {
    message: "bankName is required for BANK payments",
    path: ["bankName"],
  }
);


export const updateSaleItemsSchema = z.object({
  items: z
    .array(
      z.object({
        priceCategoryId: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().positive().optional(),
        soldPrice: z.coerce.number().min(0).optional(),
      })
    )
    .min(1, "Items must be a non-empty array"),
});


export const confirmSalesBulkSchema = z.object({
  saleIds: z
    .array(z.coerce.number().int().positive())
    .min(1, "saleIds cannot be empty"),
});


export const syncSaleSchema = z.object({
  sellerId: z.coerce.number().int().positive().optional(), 
  items: z.array(
    z.object({
      priceCategoryId: z.coerce.number().int().positive(),
      quantity: z.coerce.number().int().positive(),
      soldPrice: z.coerce.number().min(0),
    })
  ).min(1),
  payments: z.array(
    z.object({
      method: z.enum(["CASH", "BANK"]),
      amount: z.coerce.number().positive(),
      bankName: z.string().trim().optional(),
    })
  )
});

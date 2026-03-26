
import prisma from "../prismaClient.js";
import { Prisma } from "@prisma/client";

export interface CreateStockInput {
  productVariantId: number;
  branchId: number;      // Mandatory for multi-tenancy
  costPrice: number;     // Renamed from purchasePrice to match ProductVariant
  quantity: number;
}

export async function createOrUpdateStock({
  productVariantId,
  branchId,
  costPrice,
  quantity,
}: CreateStockInput) {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  // 1. Verify the variant exists
  const variant = await prisma.productVariant.findUnique({
    where: { id: productVariantId },
  });

  if (!variant) {
    throw new Error("Product variant not found");
  }

  // 2. Find existing stock for THIS SPECIFIC BRANCH
  const existingStock = await prisma.stock.findUnique({
    where: {
      branchId_productVariantId: {
        branchId,
        productVariantId,
      },
    },
  });

  // 3. Update existing or Create new
  if (existingStock) {
    // Weighted average calculation using Decimal for precision
    const oldQty = new Prisma.Decimal(existingStock.quantity);
    const oldPrice = new Prisma.Decimal(variant.costPrice); // Using variant's current cost
    const newQty = new Prisma.Decimal(quantity);
    const newPrice = new Prisma.Decimal(costPrice);

    const totalOldValue = oldQty.times(oldPrice);
    const totalNewValue = newQty.times(newPrice);
    const totalQty = oldQty.plus(newQty);
    
    const weightedAvg = totalOldValue.plus(totalNewValue).div(totalQty);

    return await prisma.$transaction([
      // Update the stock quantity
      prisma.stock.update({
        where: { id: existingStock.id },
        data: { quantity: { increment: quantity } },
      }),
      // Update the Variant's cost price (Global for the product)
      prisma.productVariant.update({
        where: { id: productVariantId },
        data: { costPrice: weightedAvg },
      })
    ]);
  }

  // 4. Create new stock record for this branch
  return prisma.stock.create({
    data: {
      branchId,
      productVariantId,
      quantity,
    },
  });
}

// Total capital based on cost price (Scoped by Branch)
export async function getTotalPurchaseValue(branchId: number) {
  const stocks = await prisma.stock.findMany({
    where: { branchId },
    include: { productVariant: true },
  });

  return stocks.reduce((sum, stock) => {
    const cost = new Prisma.Decimal(stock.productVariant.costPrice);
    return sum.plus(cost.times(stock.quantity));
  }, new Prisma.Decimal(0));
}

// Total potential value based on selling price (Scoped by Branch)
export async function getTotalSellingValue(branchId: number) {
  const stocks = await prisma.stock.findMany({
    where: { branchId },
    include: {
      productVariant: true,
    },
  });

  return stocks.reduce((sum, stock) => {
    const price = new Prisma.Decimal(stock.productVariant.sellingPrice);
    return sum.plus(price.times(stock.quantity));
  }, new Prisma.Decimal(0));
}


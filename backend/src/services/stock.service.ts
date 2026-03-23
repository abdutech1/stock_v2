import prisma from "../prismaClient.js";

export interface CreateStockInput {
  priceCategoryId: number;
  purchasePrice: number;
  quantity: number;
}


export async function createOrUpdateStock({
  priceCategoryId,
  purchasePrice,
  quantity,
}: CreateStockInput) {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  const priceCategory = await prisma.pricecategory.findUnique({
    where: { id: priceCategoryId },
  });

  if (!priceCategory) {
    throw new Error("Price category not found");
  }

  const existingStock = await prisma.stock.findUnique({
    where: { priceCategoryId },
  });

  // 1️⃣ If stock exists
  if (existingStock) {
    let newPurchasePrice = existingStock.purchasePrice;

    // If price changed → calculate weighted average
    if (existingStock.purchasePrice !== purchasePrice) {
      const totalOldValue =
        existingStock.quantity * existingStock.purchasePrice;

      const totalNewValue = quantity * purchasePrice;

      newPurchasePrice =
        (totalOldValue + totalNewValue) /
        (existingStock.quantity + quantity);
    }

    return prisma.stock.update({
      where: { priceCategoryId },
      data: {
        quantity: { increment: quantity },
        purchasePrice: newPurchasePrice,
      },
    });
  }

  // 2️⃣ Create new stock
  return prisma.stock.create({
    data: {
      priceCategoryId,
      purchasePrice,
      quantity,
    },
  });
}


// Total capital based on purchase price
export async function getTotalPurchaseValue() {
  const stocks = await prisma.stock.findMany();

  const total = stocks.reduce((sum, stock) => {
    return sum + stock.quantity * stock.purchasePrice;
  }, 0);

  return total;
}

// Total potential value based on fixed price
export async function getTotalFixedValue() {
  const stocks = await prisma.stock.findMany({
    include: {
      pricecategory: true,
    },
  });

  const total = stocks.reduce((sum, stock) => {
    return sum + stock.quantity * stock.pricecategory.fixedPrice;
  }, 0);

  return total;
}




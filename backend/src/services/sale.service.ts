import prisma from "../prismaClient.js";

interface CreateSaleInput {
  employeeId: number;
}

export async function createSale({ employeeId }: CreateSaleInput) {
  return prisma.sale.create({
    data: {
      employeeId,
      status: "DRAFT",
    },
  });
}

interface AddSaleItemInput {
  saleId: number;
  priceCategoryId: number;
  quantity: number;
  soldPrice: number;
}

export async function addSaleItem({
  saleId,
  priceCategoryId,
  quantity,
  soldPrice,
}: AddSaleItemInput) {
  return prisma.$transaction(async (tx) => {
    const stock = await tx.stock.findUnique({ where: { priceCategoryId } });
    if (!stock || stock.quantity < quantity) throw new Error("Insufficient stock");

    const saleItem = await tx.saleItem.upsert({
      where: { saleId_priceCategoryId: { saleId, priceCategoryId } },
      update: { quantity: { increment: quantity }, soldPrice },
      create: { saleId, priceCategoryId, quantity, soldPrice },
    });

    await tx.stock.update({
      where: { priceCategoryId },
      data: { quantity: { decrement: quantity } },
    });

    // ✅ Return the updated/created saleItem
    return saleItem;
  });
}


interface AddSalePaymentInput {
  saleId: number;
  method: "CASH" | "BANK";
  amount: number;
  bankName?: string;
}


export async function addSalePayment(data: AddSalePaymentInput) {
  const { saleId, method, amount, bankName } = data;

  const sale = await prisma.sale.findUnique({
    where: { id: saleId }
  });

  if (!sale) {
    throw new Error(`Sale with ID ${saleId} not found.`);
  }

  if (method === "BANK" && !bankName) {
    throw new Error("Bank name required");
  }

  return prisma.salePayment.create({
    data: {
      saleId,
      method,
      amount,
      bankName
    }
  });
}

export async function clearSalePayments(saleId: number) {
  return prisma.salePayment.deleteMany({
    where: { saleId }
  });
}

export async function confirmSale(saleId: number) {
  return prisma.$transaction(async (tx) => {
    const items = await tx.saleItem.findMany({ where: { saleId } });
    const payments = await tx.salePayment.findMany({ where: { saleId } });

    if (!items.length) throw new Error("Sale has no items");
    if (!payments.length) throw new Error("Sale has no payments");

    const itemsTotal = items.reduce((sum, i) => sum + i.quantity * i.soldPrice, 0);
    const paymentsTotal = payments.reduce((sum, p) => sum + p.amount, 0);

    if (itemsTotal !== paymentsTotal)
      throw new Error("Payment total does not match sale total");

    return tx.sale.update({
      where: { id: saleId },
      data: { status: "CONFIRMED" },
    });
  });
}




export async function getTodaySalesForOwner() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: start, lte: end } },
    include: {
      user: { select: { id: true, name: true } },
      items: { include: { pricecategory: { include: { category: true } } } },
      payments: true,
    },
    orderBy: { createdAt: "asc" },
  });

  let totalIncludingDrafts = { cash: 0, bank: 0 };
  let totalConfirmedOnly = { cash: 0, bank: 0 };

  const categoryQuantities: Record<string, number> = {}; // track total quantity per category

  const formatted = sales.map((s) => {
    const itemsTotal = s.items.reduce((sum, i) => sum + i.quantity * i.soldPrice, 0);

    const paymentsTotal = s.payments.reduce((sum, p) => sum + p.amount, 0);

    // Update totals
    s.payments.forEach((p) => {
      if (p.method === "CASH") totalIncludingDrafts.cash += p.amount;
      if (p.method === "BANK") totalIncludingDrafts.bank += p.amount;

      if (s.status === "CONFIRMED") {
        if (p.method === "CASH") totalConfirmedOnly.cash += p.amount;
        if (p.method === "BANK") totalConfirmedOnly.bank += p.amount;
      }
    });

    // Update category quantities
    s.items.forEach((i) => {
      const categoryName = i.pricecategory.category.name;
      categoryQuantities[categoryName] = (categoryQuantities[categoryName] || 0) + i.quantity;
    });

    return {
      saleId: s.id,
      employeeName: s.user.name,
      items: s.items.map((i) => ({
        categoryName: i.pricecategory.category.name,
        priceCategoryId: i.priceCategoryId,
        quantity: i.quantity,
        soldPrice: i.soldPrice,
      })),
      payments: s.payments.map((p) => ({
        method: p.method,
        amount: p.amount,
        bankName: p.bankName,
      })),
      itemsTotal,
      paymentsTotal,
      status: s.status,
      createdAt: s.createdAt,
    };
  });

  const summary = {
    totalSalesCount: sales.length,
    totalAmountIncludingDrafts: totalIncludingDrafts,
    totalAmountConfirmedOnly: totalConfirmedOnly,
    totalQuantitySoldPerCategory: categoryQuantities,
  };

  return { summary, sales: formatted };
}







interface UpdateSaleItemInput {
  saleId: number;
  items: {
    priceCategoryId: number;
    quantity?: number;   // optional
    soldPrice?: number;  // optional for existing, mandatory for new
  }[];
}

export async function updateSaleItems({ saleId, items }: UpdateSaleItemInput) {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Fetch the sale with its items
    const sale = await tx.sale.findUnique({
      where: { id: saleId },
      include: { items: true },
    });
    if (!sale) throw new Error("Sale not found");
    if (sale.status !== "DRAFT") throw new Error("Only DRAFT sales can be edited");

    // 2️⃣ Process each item
    for (const item of items) {
      const existing = await tx.saleItem.findUnique({
        where: { saleId_priceCategoryId: { saleId, priceCategoryId: item.priceCategoryId } },
      });

      const stock = await tx.stock.findUnique({ where: { priceCategoryId: item.priceCategoryId } });
      if (!stock) throw new Error(`Stock missing for priceCategoryId ${item.priceCategoryId}`);

      if (existing) {
        // Updating existing item
        const newQuantity = item.quantity !== undefined ? item.quantity : existing.quantity;
        const diff = newQuantity - existing.quantity;

        if (diff > 0 && stock.quantity < diff) throw new Error("Insufficient stock");

        // Update the item
        await tx.saleItem.update({
          where: { id: existing.id },
          data: {
            quantity: newQuantity,
            soldPrice: item.soldPrice !== undefined ? item.soldPrice : existing.soldPrice,
          },
        });

        // Update stock
        if (diff !== 0) {
          await tx.stock.update({
            where: { priceCategoryId: item.priceCategoryId },
            data: { quantity: { decrement: diff } },
          });
        }
      } else {
        // New item → soldPrice is mandatory
        if (item.soldPrice === undefined) throw new Error(`soldPrice is required for new sale item priceCategoryId ${item.priceCategoryId}`);
        const newQuantity = item.quantity ?? 1;

        if (stock.quantity < newQuantity) throw new Error("Insufficient stock");

        await tx.saleItem.create({
          data: {
            saleId,
            priceCategoryId: item.priceCategoryId,
            quantity: newQuantity,
            soldPrice: item.soldPrice,
          },
        });

        // Decrement stock
        await tx.stock.update({
          where: { priceCategoryId: item.priceCategoryId },
          data: { quantity: { decrement: newQuantity } },
        });
      }
    }

    // 3️⃣ Remove any items not in the updated list
    const itemsToRemove = sale.items.filter(
      old => !items.some(i => i.priceCategoryId === old.priceCategoryId)
    );
    for (const old of itemsToRemove) {
      await tx.stock.update({
        where: { priceCategoryId: old.priceCategoryId },
        data: { quantity: { increment: old.quantity } },
      });
      await tx.saleItem.delete({ where: { id: old.id } });
    }

    // 4️⃣ Return updated sale with items & payments
    return tx.sale.findUnique({
      where: { id: saleId },
      include: { items: true, payments: true },
    });
  });
}




export async function deleteDraftSaleById(saleId: number) {
  return prisma.$transaction(async (tx) => {
    // Fetch the sale with items and payments
    const sale = await tx.sale.findUnique({
      where: { id: saleId },
      include: { items: true, payments: true },
    });

    if (!sale) throw new Error("Sale not found");
    if (sale.status !== "DRAFT") throw new Error("Only DRAFT sales can be deleted");

    // 1️⃣ Return stock for all items
    for (const item of sale.items) {
      await tx.stock.update({
        where: { priceCategoryId: item.priceCategoryId },
        data: { quantity: { increment: item.quantity } },
      });
    }

    // 2️⃣ Delete all sale payments
    if (sale.payments.length > 0) {
      await tx.salePayment.deleteMany({ where: { saleId } });
    }

    // 3️⃣ Delete all sale items
    if (sale.items.length > 0) {
      await tx.saleItem.deleteMany({ where: { saleId } });
    }

    // 4️⃣ Delete the sale itself
    return tx.sale.delete({ where: { id: saleId } });
  });
}




export async function confirmSalesBulk(saleIds: number[]) {
  if (!Array.isArray(saleIds) || saleIds.length === 0) {
    throw new Error("saleIds must be a non-empty array");
  }

  return prisma.$transaction(async (tx) => {
    const results: {
      saleId: number;
      status: "CONFIRMED" | "SKIPPED" | "FAILED";
      reason?: string;
    }[] = [];

    for (const saleId of saleIds) {
      try {
        const sale = await tx.sale.findUnique({
          where: { id: saleId },
          include: { items: true, payments: true },
        });

        if (!sale) {
          results.push({ saleId, status: "FAILED", reason: "Sale not found" });
          continue;
        }

        if (sale.status !== "DRAFT") {
          results.push({ saleId, status: "SKIPPED", reason: "Not in DRAFT status" });
          continue;
        }

        if (!sale.items.length) {
          results.push({ saleId, status: "FAILED", reason: "Sale has no items" });
          continue;
        }

        if (!sale.payments.length) {
          results.push({ saleId, status: "FAILED", reason: "Sale has no payments" });
          continue;
        }

        const itemsTotal = sale.items.reduce(
          (sum, i) => sum + i.quantity * i.soldPrice,
          0
        );

        const paymentsTotal = sale.payments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        if (itemsTotal !== paymentsTotal) {
          results.push({
            saleId,
            status: "FAILED",
            reason: "Payments total does not match items total",
          });
          continue;
        }

        await tx.sale.update({
          where: { id: saleId },
          data: { status: "CONFIRMED" },
        });

        results.push({ saleId, status: "CONFIRMED" });
      } catch (err: any) {
        results.push({
          saleId,
          status: "FAILED",
          reason: err.message,
        });
      }
    }

    return {
      requested: saleIds.length,
      confirmed: results.filter(r => r.status === "CONFIRMED").length,
      skipped: results.filter(r => r.status === "SKIPPED").length,
      failed: results.filter(r => r.status === "FAILED").length,
      results,
    };
  });
}


export async function deleteEmptyDraftSales() {
  return prisma.sale.deleteMany({
    where: {
      status: "DRAFT",
      items: { none: {} },    
      payments: { none: {} }  
    }
  });
}





// export async function syncSaleDetails({ 
//   saleId, items, payments 
// }: { 
//   saleId: number; 
//   items: any[]; 
//   payments: any[] 
// }) {
//   return prisma.$transaction(async (tx) => {
//     // 1. Reuse your existing logic to update items & stock
//     // (You can call your updateSaleItems logic here or embed it)
//     await updateSaleItems({ saleId, items });

//     // 2. Clear and replace payments (Syncing)
//     await tx.salePayment.deleteMany({ where: { saleId } });
    
//     if (payments.length > 0) {
//       await tx.salePayment.createMany({
//         data: payments.map(p => ({
//           saleId,
//           method: p.method,
//           amount: p.amount,
//           bankName: p.bankName,
//         })),
//       });
//     }

//     return tx.sale.findUnique({
//       where: { id: saleId },
//       include: { items: true, payments: true }
//     });
//   });
// }



export async function syncSaleDetails({ 
  saleId, 
  items, 
  payments, 
  employeeId 
}: { 
  saleId: number; 
  items: any[]; 
  payments: any[];
  employeeId?: number; 
}) {
  return prisma.$transaction(async (tx) => {
    await updateSaleItems({ saleId, items });

    await tx.salePayment.deleteMany({ where: { saleId } });
    
    if (payments.length > 0) {
      await tx.salePayment.createMany({
        data: payments.map(p => ({
          saleId,
          method: p.method,
          amount: p.amount,
          bankName: p.bankName,
        })),
      });
    }

    return tx.sale.update({
      where: { id: saleId },
      data: {
        ...(employeeId && { employeeId }) 
      },
      include: { items: true, payments: true }
    });
  });
}

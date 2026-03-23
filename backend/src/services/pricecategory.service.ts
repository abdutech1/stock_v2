import prisma from "../prismaClient.js";
import fs from "fs";
import path from "path";

interface CreatePriceCategoryInput {
  categoryId: number;
  fixedPrice: number;
  imageUrl?: string;
}

export async function createPriceCategoryService({
  categoryId,
  fixedPrice,
  imageUrl,
}: CreatePriceCategoryInput) {
  if (!categoryId || !fixedPrice) {
    throw new Error("Missing fields");
  }

  const existing = await prisma.pricecategory.findFirst({
    where: { categoryId, fixedPrice },
  });

  if (existing) return existing;

  return await prisma.pricecategory.create({
    data: {
      categoryId,
      fixedPrice,
      imageUrl,
    },
  });
}

export async function getAllActivePriceCategories() {
  return await prisma.pricecategory.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { category: { name: "asc" } },
  });
}

export async function getActivePriceCategories(categoryId: number) {
  return await prisma.pricecategory.findMany({
    where: {
      categoryId,
      isActive: true,
    },
    include: { stock: true },
  });
}

export async function deactivatePriceCategory(id: number) {
  const pc = await prisma.pricecategory.findUnique({
     where: { id },
    include: { stock: true }
   });
  if (!pc) throw new Error("Price category not found");

   if (pc.stock && pc.stock.quantity > 0) {
    throw new Error(
      "Cannot deactivate price category with active stock"
    );
  }

  return await prisma.pricecategory.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function activatePriceCategory(id: number) {
  const pc = await prisma.pricecategory.findUnique({ where: { id } });
  if (!pc) throw new Error("Price category not found");

  return await prisma.pricecategory.update({
    where: { id },
    data: { isActive: true },
  });
}

export async function updatePriceCategory(
  id: number,
  fixedPrice?: number,
  imageUrl?: string
) {
  const pc = await prisma.pricecategory.findUnique({ where: { id } });
  if (!pc) throw new Error("Price category not found");

  // delete old image if replaced
  if (imageUrl && pc.imageUrl) {
    const oldPath = path.join(process.cwd(), pc.imageUrl);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  return await prisma.pricecategory.update({
    where: { id },
    data: {
      fixedPrice: fixedPrice ?? pc.fixedPrice,
      imageUrl: imageUrl ?? pc.imageUrl,
    },
  });
}

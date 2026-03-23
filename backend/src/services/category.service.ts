import prisma from "../prismaClient.js";
import fs from "fs";
import path from "path";

export async function getAllActiveCategories() {
  return await prisma.category.findMany({
    where: { isActive: true },
    include: { pricecategory: true },
  });
}

export async function createCategory(name: string, imageUrl?: string) {
  if (!name) throw new Error("Category name is required");

  return await prisma.category.upsert({
    where: { name },
    update: {
      imageUrl: imageUrl ?? undefined,
    },
    create: {
      name,
      imageUrl,
    },
  });
}

export async function deactivateCategory(categoryId: number) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) throw new Error("Category not found");

  const hasStock = await prisma.stock.findFirst({
  where: {
    pricecategory: {
      categoryId,
    },
    quantity: { gt: 0 },
  },
});

if (hasStock) {
  throw new Error("Cannot deactivate category with active stock");
}


  return await prisma.category.update({
    where: { id: categoryId },
    data: { isActive: false },
  });
}


export async function activateCategory(categoryId: number) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) throw new Error("Category not found");

  if (category.isActive) {
    throw new Error("Category is already active");
  }

  return await prisma.category.update({
    where: { id: categoryId },
    data: { isActive: true },
  });
}


interface UpdateCategoryInput {
  categoryId: number;
  name?: string;
  imageUrl?: string;
}

export async function updateCategory({
  categoryId,
  name,
  imageUrl,
}: UpdateCategoryInput) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // 🧹 Delete old image if new one is uploaded
  if (imageUrl && category.imageUrl) {
    const oldImagePath = path.join(
      process.cwd(),
      category.imageUrl
    );

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }

  return await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: name ?? category.name,
      imageUrl: imageUrl ?? category.imageUrl,
    },
  });
}



export async function deleteCategory(id: number) {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new Error("Category not found");
  }

  const hasStock = await prisma.stock.findFirst({
    where: { 
      pricecategory: { categoryId: id }, 
      quantity: { gt: 0 } 
    },
  });

  if (hasStock) {
    throw new Error("Cannot delete category with active stock");
  }

  if (category.imageUrl) {
    const imagePath = path.join(process.cwd(), category.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  return await prisma.category.delete({ where: { id } });
}
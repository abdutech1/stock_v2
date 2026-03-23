import { Request, Response } from "express";
import prisma from "../../prismaClient.js";
import {
  createOrUpdateStock,
  getTotalPurchaseValue,
  getTotalFixedValue,
} from "../../services/stock.service.js";

export async function registerStock(req: Request, res: Response) {
  try {
    const stock = await createOrUpdateStock(req.body);
    res.status(201).json({
      message: "Stock registered/updated successfully",
      stock,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateStock(req: Request, res: Response) {
  try {
    const priceCategoryId = Number(req.params.priceCategoryId);

    // Validate existence of stock first
    const stockToUpdate = await prisma.stock.findUnique({
      where: { priceCategoryId },
    });

    if (!stockToUpdate) {
      return res.status(404).json({ message: "Stock not found" });
    }

    //Destructure validated data from req.body
    const { purchasePrice, quantity } = req.body;

    //Prevent update if sales exist (Business Logic Safety)
    const saleCount = await prisma.saleItem.count({
      where: { priceCategoryId },
    });

    if (saleCount > 0) {
      return res.status(400).json({
        message:
          "Cannot modify stock because sales records exist for this item",
      });
    }

    // Perform the update

    const stock = await prisma.stock.update({
      where: { priceCategoryId },
      data: {
        ...(purchasePrice !== undefined && { purchasePrice }),
        ...(quantity !== undefined && { quantity }),
      },
    });

    res.json({
      message: "Stock updated successfully",
      stock,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getStockBySubcategory(req: Request, res: Response) {
  try {
    const priceCategoryId = Number(req.params.priceCategoryId);

    const stock = await prisma.stock.findUnique({
      where: { priceCategoryId },
      include: { pricecategory: true },
    });

    if (!stock) return res.status(404).json({ message: "Stock not found" });

    res.json(stock);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function deleteStock(req: Request, res: Response) {
  try {
    const priceCategoryId = Number(req.params.priceCategoryId);

    const stock = await prisma.stock.findUnique({
      where: { priceCategoryId },
    });

    if (!stock) {
      return res.status(404).json({
        message: "Stock not found",
      });
    }

    //block delete if sales exist
    const saleCount = await prisma.saleItem.count({
      where: {
        priceCategoryId: priceCategoryId,
      },
    });

    if (saleCount > 0) {
      return res.status(400).json({
        message:
          "Cannot Delete stock because sales records exist for this item",
      });
    }

    await prisma.stock.delete({
      where: { priceCategoryId },
    });

    res.json({ message: "Stock deleted successfully" });
  } catch (error: any) {
    console.error(error); 
    res.status(500).json({ message: "Internal server error" });
  }
}

// Owner capital (purchase price)
export async function getTotalPurchaseValueController(
  req: Request,
  res: Response,
) {
  try {
    const total = await getTotalPurchaseValue();
    res.json({
      type: "PURCHASE_VALUE",
      total,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// Potential selling value (fixed price)
export async function getTotalFixedValueController(
  req: Request,
  res: Response,
) {
  try {
    const total = await getTotalFixedValue();
    res.json({
      type: "FIXED_VALUE",
      total,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}




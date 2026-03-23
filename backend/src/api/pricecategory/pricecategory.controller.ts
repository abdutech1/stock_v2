import { Request, Response } from "express";
import {
  createPriceCategoryService,
  getActivePriceCategories,
  deactivatePriceCategory,
  activatePriceCategory,
  updatePriceCategory,
  getAllActivePriceCategories
} from "../../services/pricecategory.service.js";



export async function fetchAllActive(req: Request, res: Response) {
  try {
    const pcs = await getAllActivePriceCategories();
    res.json(pcs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getPriceCategories(req: Request, res: Response) {
  try {
    const { categoryId } = req.params;
    const pcs = await getActivePriceCategories(Number(categoryId));
    res.json(pcs);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}


export async function createPriceCategory(req: Request, res: Response) {
  try {
    const { categoryId, fixedPrice } = req.body;

    const imageUrl = req.file
      ? `/uploads/pricecategories/${req.file.filename}`
      : undefined;

    const pc = await createPriceCategoryService({
      categoryId,
      fixedPrice,
      imageUrl,
    });

    res.status(201).json(pc);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}


export async function updatePriceCategoryController(
  req: Request,
  res: Response
) {
  try {
    const { fixedPrice } = req.body;
    const { id } = req.params;

    const imageUrl = req.file
      ? `/uploads/pricecategories/${req.file.filename}`
      : undefined;

    const pc = await updatePriceCategory(
      Number(id),
      fixedPrice,
      imageUrl
    );

    res.json({ message: "Price category updated", pc });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}


export async function deactivatePriceCategoryController(
  req: Request,
  res: Response
) {
  try {
    const pc = await deactivatePriceCategory(Number(req.params.id));
    res.json({ message: "Price category deactivated", pc });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function activatePriceCategoryController(
  req: Request,
  res: Response
) {
  try {
    const pc = await activatePriceCategory(Number(req.params.id));
    res.json({ message: "Price category activated", pc });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}




import { Request, Response } from "express";
import {
  getAllActiveCategories,
  createCategory,
  deactivateCategory,
  activateCategory,
  updateCategory,
  deleteCategory
} from "../../services/category.service.js";

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await getAllActiveCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function createCategoryController(
  req: Request,
  res: Response
) {
  try {
    const { name } = req.body;

    const imageUrl = req.file
      ? `/uploads/categories/${req.file.filename}`
      : undefined;

    const category = await createCategory(name, imageUrl);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}


export async function deactivateCategoryController(
  req: Request,
  res: Response
) {
  try {
    const categoryId = Number(req.params.id);

    

    const category = await deactivateCategory(categoryId);
    res.json({
      message: "Category deactivated successfully",
      category,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}



export async function activateCategoryController(
  req: Request,
  res: Response
) {
  try {
    const categoryId = Number(req.params.id);

    const category = await activateCategory(categoryId);

    res.json({
      message: "Category activated successfully",
      category,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}



export async function updateCategoryController(
  req: Request,
  res: Response
) {
  try {
    const categoryId = Number(req.params.id);
    const { name } = req.body;

    const imageUrl = req.file
      ? `/uploads/categories/${req.file.filename}`
      : undefined;

    const updatedCategory = await updateCategory({
      categoryId,
      name,
      imageUrl,
    });

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}




export async function deleteCategoryController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    
    await deleteCategory(id);

    res.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    
    const status = error.message === "Category not found" ? 404 : 400;
    res.status(status).json({ message: error.message });
  }
}
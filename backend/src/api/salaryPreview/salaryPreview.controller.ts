import { Request, Response } from "express";
import { previewSalary } from "../../services/salaryPreview.service.js";
import { salaryPreviewSchema } from "../../schemas/salarypreview.schema.js";
import {z} from 'zod'

export async function previewSalaryController(req: Request, res: Response) {
  try {
    const validatedData = salaryPreviewSchema.parse(req.body);
    const preview = await previewSalary(validatedData);
    res.json(preview);
  } catch (error: any) {
    console.error("DEBUG ERROR:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        errors: error.issues 
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}
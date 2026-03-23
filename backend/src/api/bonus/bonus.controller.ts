import { Request, Response } from "express";
import { z } from "zod";
import prisma from "@/prismaClient.js";
import { applyBonusPayment } from "../../services/bonus.service.js";
import { applyBonusSchema } from "../../schemas/bonus.schema.js";

export async function applyBonusController(req: Request, res: Response) {
  try {
    const validatedData = applyBonusSchema.parse(req.body);

    const result = await applyBonusPayment(validatedData);

    res.json({ 
      success: true,
      message: "Bonus applied successfully", 
      result 
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.issues });
    }
    res.status(400).json({ success: false, message: error.message });
  }
}


export async function getBonusPaymentsController(req: Request, res: Response) {
  try {
    const bonuses = await prisma.bonusPayment.findMany({
      include: {
        user: {
          select: { name: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(bonuses);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch bonus payments" });
  }
}

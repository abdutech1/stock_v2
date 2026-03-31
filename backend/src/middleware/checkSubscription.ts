import { Request, Response, NextFunction } from "express";
import prisma from "../prismaClient.js"; 
import { AppError } from "@/utils/AppError.js";

export const checkSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Immediate safety check
    if (!req.user?.organizationId) {
      throw new AppError("Organization access required", 403);
    }

    const organization = await prisma.organization.findUnique({
      where: { id: req.user.organizationId },
      include: {
        subscriptions: {
          where: { isActive: true },
          orderBy: { endsAt: "desc" },
          take: 1,
        },
      },
    });

    if (!organization) throw new AppError("Organization not found", 404);

    const subscription = organization.subscriptions[0];
    if (!subscription) throw new AppError("No active subscription found", 402);

    const now = new Date();
    const daysRemaining = Math.ceil((subscription.endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Hard block
    if (now > subscription.endsAt) {
      throw new AppError(`Subscription expired ${Math.abs(daysRemaining)} days ago.`, 402);
    }

    // Soft Warning
    if (daysRemaining <= 3) {
      res.setHeader("X-Subscription-Warning", `Your ${subscription.plan} plan expires in ${daysRemaining} days.`);
      res.setHeader("Access-Control-Expose-Headers", "X-Subscription-Warning");
    }

    next();
  } catch (error) {
    next(error);
  }
};
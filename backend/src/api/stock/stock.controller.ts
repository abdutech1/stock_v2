import { Request, Response } from "express";
import prisma from "../../prismaClient.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";
import { 
  createOrUpdateStock, 
  getTotalPurchaseValue, 
  getTotalSellingValue 
} from "../../services/stock.service.js";


// Register / Create (No changes needed, but here it is for context)
export const registerStock = catchAsync(async (req: Request, res: Response) => {
  const branchId = req.user?.branchId;
  if (!branchId) throw new AppError("No active branch selected", 400);

  // We override branchId from the auth context so the client can't "spoof" it
  const stock = await createOrUpdateStock({
    ...req.body,
    branchId 
  });

  res.status(201).json({ status: "success", data: stock });
});

// Update (Now uses variantId from URL + branchId from Auth)
export const updateStock = catchAsync(async (req: Request, res: Response) => {
  const variantId = Number(req.params.variantId); // From URL
  const branchId = req.user?.branchId;           // From Auth Session
  const orgId = req.user?.organizationId;       // From Auth Session

  if (!branchId) throw new AppError("Branch context missing", 400);

  // 1. Verify existence AND ownership (Multi-tenant check)
  const stock = await prisma.stock.findFirst({
    where: { 
      branchId, 
      productVariantId: variantId,
      branch: { organizationId: orgId } // Security: Branch must belong to user's Org
    }
  });

  if (!stock) throw new AppError("Stock not found in your organization", 404);

  // 2. Business Logic: Block if sales exist
  const saleCount = await prisma.saleItem.count({
    where: { 
      productVariantId: variantId, 
      sale: { branchId } 
    }
  });

  if (saleCount > 0) throw new AppError("Cannot modify stock: sales records exist", 400);

  // 3. Perform update
  const { costPrice, quantity } = req.body;
  const updatedStock = await prisma.stock.update({
    where: { id: stock.id },
    data: { 
      quantity, 
      productVariant: { update: { costPrice } } 
    }
  });

  res.json({ status: "success", data: updatedStock });
});



// Get Valuation (Scoped to User's Branch)
export const getBranchValuation = catchAsync(async (req: Request, res: Response) => {
  const branchId = req.user?.branchId;
  if (!branchId) throw new AppError("Branch ID is required", 400);

  const [purchaseValue, sellingValue] = await Promise.all([
    getTotalPurchaseValue(branchId),
    getTotalSellingValue(branchId)
  ]);

  res.json({
    status: "success",
    data: { purchaseValue, sellingValue }
  });
});

// Delete (Matched to the simplified pattern)
export const deleteStock = catchAsync(async (req: Request, res: Response) => {
  const variantId = Number(req.params.variantId);
  const branchId = req.user?.branchId;

  if (!branchId) throw new AppError("No branch selected", 400);

  const saleCount = await prisma.saleItem.count({
    where: { productVariantId: variantId, sale: { branchId } }
  });

  if (saleCount > 0) throw new AppError("Cannot delete: linked to sales", 400);

  await prisma.stock.delete({
    where: { 
        branchId_productVariantId: { 
            branchId, 
            productVariantId: variantId 
        } 
    }
  });

  res.status(204).send(); 
});
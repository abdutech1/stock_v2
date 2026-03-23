import { Request, Response } from "express";
import {
  createSale,
  addSaleItem,
  addSalePayment,
  confirmSale,
  getTodaySalesForOwner,
  updateSaleItems,
  deleteDraftSaleById,
  confirmSalesBulk,
  deleteEmptyDraftSales,
  clearSalePayments,
  syncSaleDetails
} from "../../services/sale.service.js";


export async function createSaleController(req: Request, res: Response) {
  try {
    const employeeId = req.user!.id;
    const sale = await createSale({ employeeId });
    res.status(201).json(sale);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function addSaleItemController(req: Request, res: Response) {
  try {
    const { saleId, priceCategoryId, quantity, soldPrice } = req.body;
    const item = await addSaleItem({
      saleId,
      priceCategoryId,
      quantity,
      soldPrice,
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function addSalePaymentController(req: Request, res: Response) {
  try {
    const { saleId, method, amount, bankName } = req.body;
    const payment = await addSalePayment({
      saleId,
      method,
      amount,
      bankName,
    });
    res.status(201).json(payment);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}


export async function clearSalePaymentsController(req: Request, res: Response) {
  try {
    const saleId = req.params.id;
    await clearSalePayments(Number(saleId));
    res.json({ message: "Payments cleared" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}



/**
 * OWNER
 */
export async function confirmSaleController(req: Request, res: Response) {
  try {
    const saleId = req.params.id;
    const sale = await confirmSale(Number(saleId));
    res.json({ message: "Sale confirmed", sale });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function confirmSalesBulkController(req: Request, res: Response) {
  try {
    const { saleIds } = req.body;
    const summary = await confirmSalesBulk(saleIds);
    res.status(200).json({
      message: "Bulk sale confirmation completed",
      summary,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getTodaySalesController(req: Request, res: Response) {
  try {
    const sales = await getTodaySalesForOwner();
    res.json(sales);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateSaleItemsController(req: Request, res: Response) {
  try {
    const saleId = req.params.id;
    const { items } = req.body;

    const updatedSale = await updateSaleItems({
      saleId: Number(saleId),
      items,
    });

    res.json({
      message: "Draft sale updated successfully",
      sale: updatedSale,
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteDraftSaleController(req: Request, res: Response) {
  try {
    const saleId = req.params.id;
    const deleted = await deleteDraftSaleById(Number(saleId));
    res.json({ message: "Draft sale deleted", sale: deleted });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}


export async function deleteEmptyDraftSalesController(req: Request, res: Response) {
  try {
    const result = await deleteEmptyDraftSales();
    res.json({ 
      message: "Empty draft sales cleaned up successfully", 
      count: result.count 
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}



// export async function syncSaleController(req: Request, res: Response) {
//   try {
//     const saleId = Number(req.params.id);
//     const { items, payments } = req.body;
//     const result = await syncSaleDetails({ saleId, items, payments });
//     res.json({ message: "Sale draft updated successfully", sale: result });
//   } catch (err: any) {
//     res.status(400).json({ message: err.message });
//   }
// }

export async function syncSaleController(req: Request, res: Response) {
  try {
    const saleId = Number(req.params.id);
    
    const { items, payments, sellerId } = req.body; 

    const result = await syncSaleDetails({ 
      saleId, 
      items, 
      payments, 
      employeeId: sellerId 
    });

    res.json({ message: "Sale draft updated successfully", sale: result });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
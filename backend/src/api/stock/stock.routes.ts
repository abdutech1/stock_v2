import express from "express";
import { 
  registerStock, 
  getStockBySubcategory, 
  updateStock, 
  deleteStock, 
  getTotalPurchaseValueController, 
  getTotalFixedValueController,
} from "./stock.controller.js";
import { validate } from "../../middleware/validate.js";
import { registerStockSchema, updateStockSchema } from "../../schemas/stock.schema.js";

const router = express.Router();

router.get("/valuation/purchase", getTotalPurchaseValueController);
router.get("/valuation/fixed", getTotalFixedValueController);

// Create / Register
router.post("/", validate(registerStockSchema), registerStock);

router.get("/subcategory/:priceCategoryId", getStockBySubcategory);

// Update
router.patch("/:priceCategoryId", validate(updateStockSchema), updateStock);

router.delete("/:priceCategoryId", deleteStock);

export default router;
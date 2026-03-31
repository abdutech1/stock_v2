import express from "express";
import * as stockController from "./stock.controller.js";
import { validate } from "../../middleware/validate.js";
import { registerStockSchema, updateStockSchema } from "../../schemas/stock.schema.js";
import { checkSubscription } from "@/middleware/checkSubscription.js";

const router = express.Router();

// Valuation route usually needs a branch filter
router.get("/valuation", stockController.getBranchValuation);

// Create
router.post("/",checkSubscription, validate(registerStockSchema), stockController.registerStock);

// Get specific variant stock in a specific branch
router.get("/branch/:branchId/variant/:variantId", stockController.updateStock);

// Update & Delete using composite identifiers
router.patch("/variant/:variantId",checkSubscription, validate(updateStockSchema), stockController.updateStock);
router.delete("/variant/:variantId",checkSubscription, stockController.deleteStock);

export default router;
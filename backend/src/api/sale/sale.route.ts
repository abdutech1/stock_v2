// import express from "express";
// import { authorize } from "../../middleware/authorize.js";
// import { validate } from "../../middleware/validate.js";

// import {
//   createSaleController,
//   addSaleItemController,
//   addSalePaymentController,
//   confirmSaleController,
//   getTodaySalesController,
//   updateSaleItemsController,
//   deleteDraftSaleController,
//   confirmSalesBulkController,
//   deleteEmptyDraftSalesController,
//    clearSalePaymentsController,
//    syncSaleController
// } from "./sale.controller.js";

// import {
//   saleIdParamSchema,
//   addSaleItemSchema,
//   addSalePaymentSchema,
//   updateSaleItemsSchema,
//   confirmSalesBulkSchema,
//   syncSaleSchema
// } from "../../schemas/sale.schema.js";

// const router = express.Router();


// router.post("/", authorize("EMPLOYEE","OWNER"), createSaleController);

// router.post(
//   "/item",
//   authorize("EMPLOYEE","OWNER"),
//   validate(addSaleItemSchema),
//   addSaleItemController
// );

// router.post(
//   "/payment",
//   authorize("EMPLOYEE","OWNER"),
//   validate(addSalePaymentSchema),
//   addSalePaymentController
// );

// /**
//  * OWNER actions
//  */
// router.get("/", authorize("OWNER"), getTodaySalesController);

// router.patch(
//   "/confirm/bulk",
//   authorize("OWNER"),
//   validate(confirmSalesBulkSchema),
//   confirmSalesBulkController
// );

// router.delete(
//   "/cleanup/empty", 
//   authorize("OWNER"), 
//   deleteEmptyDraftSalesController
// );

// router.patch(
//   "/:id/confirm",
//   authorize("OWNER"),
//   validate(saleIdParamSchema, "params"),
//   confirmSaleController
// );

// router.patch(
//   "/:id/items",
//   authorize("OWNER"),
//   validate(saleIdParamSchema, "params"),
//   validate(updateSaleItemsSchema),
//   updateSaleItemsController
// );

// router.delete(
//   "/:id",
//   authorize("OWNER"),
//   validate(saleIdParamSchema, "params"),
//   deleteDraftSaleController
// );

// router.delete("/:id/payments", authorize("EMPLOYEE", "OWNER"), clearSalePaymentsController);

// router.put("/:id/sync", authorize("EMPLOYEE", "OWNER"), syncSaleController);

// export default router;






import express from "express";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";

import {
  createSaleController,
  addSaleItemController,
  addSalePaymentController,
  confirmSaleController,
  getTodaySalesController,
  updateSaleItemsController,
  deleteDraftSaleController,
  confirmSalesBulkController,
  deleteEmptyDraftSalesController,
  clearSalePaymentsController,
  syncSaleController
} from "./sale.controller.js";

import {
  saleIdParamSchema,
  addSaleItemSchema,
  addSalePaymentSchema,
  updateSaleItemsSchema,
  confirmSalesBulkSchema,
  syncSaleSchema
} from "../../schemas/sale.schema.js";

const router = express.Router();

// --- EMPLOYEE & OWNER (POS Operations) ---

// Create the initial draft
router.post("/", authorize("EMPLOYEE", "OWNER"), createSaleController);

// Sync finalizes the items, payments, and SELECTED SELLER from the POS
router.put(
  "/:id/sync", 
  authorize("EMPLOYEE", "OWNER"), 
  validate(syncSaleSchema), 
  syncSaleController
);

// Clear payments if they make a mistake during the POS session
router.delete("/:id/payments", authorize("EMPLOYEE", "OWNER"), clearSalePaymentsController);


// --- OWNER ONLY (Management & Editing) ---

router.get("/", authorize("OWNER"), getTodaySalesController);

// ONLY Owner can manually update items/quantities after the sale is initiated
router.patch(
  "/:id/items",
  authorize("OWNER"), 
  validate(saleIdParamSchema, "params"),
  validate(updateSaleItemsSchema),
  updateSaleItemsController
);

router.patch(
  "/confirm/bulk",
  authorize("OWNER"),
  validate(confirmSalesBulkSchema),
  confirmSalesBulkController
);

router.patch(
  "/:id/confirm",
  authorize("OWNER"),
  validate(saleIdParamSchema, "params"),
  confirmSaleController
);

router.delete(
  "/:id",
  authorize("OWNER"),
  validate(saleIdParamSchema, "params"),
  deleteDraftSaleController
);

router.delete(
  "/cleanup/empty", 
  authorize("OWNER"), 
  deleteEmptyDraftSalesController
);

export default router;
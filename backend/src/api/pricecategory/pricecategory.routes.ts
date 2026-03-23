import express from "express";
import {
  getPriceCategories,
  createPriceCategory,
  deactivatePriceCategoryController,
  activatePriceCategoryController,
  updatePriceCategoryController,
  fetchAllActive
} from "./pricecategory.controller.js";
import { authorize } from "../../middleware/authorize.js";
import { uploadPriceCategoryImage } from "../../middleware/uploads.js";
import { validate } from "../../middleware/validate.js";
import { handleUpload } from "@/utils/multerError.js";

import {
  categoryIdParamSchema,
  priceCategoryIdParamSchema,
  createPriceCategorySchema,
  updatePriceCategorySchema,
} from "../../schemas/pricecategory.schema.js";

const router = express.Router();

router.get("/", fetchAllActive);

router.get(
  "/:categoryId",
  validate(categoryIdParamSchema, "params"),
  getPriceCategories
);

router.post(
  "/",
  authorize("OWNER"),
  handleUpload(uploadPriceCategoryImage.single("image")),
  validate(createPriceCategorySchema),
  createPriceCategory
);

router.patch(
  "/:id/deactivate",
  authorize("OWNER"),
  validate(priceCategoryIdParamSchema, "params"),
  deactivatePriceCategoryController
);

router.patch(
  "/:id/activate",
  authorize("OWNER"),
  validate(priceCategoryIdParamSchema, "params"),
  activatePriceCategoryController
);

router.put(
  "/:id",
  authorize("OWNER"),
  validate(priceCategoryIdParamSchema, "params"),
  handleUpload(uploadPriceCategoryImage.single("image")),
  validate(updatePriceCategorySchema),
  updatePriceCategoryController
);

export default router;

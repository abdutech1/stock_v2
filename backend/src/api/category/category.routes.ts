import express from "express";
import {
  getCategories,
  createCategoryController,
  deactivateCategoryController,
  activateCategoryController,
  updateCategoryController,
  deleteCategoryController
} from "./category.controller.js";
import { authorize } from "../../middleware/authorize.js";
import { uploadCategoryImage } from "../../middleware/uploads.js";
import { validate } from "../../middleware/validate.js";
import { handleUpload } from "@/utils/multerError.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from "../../schemas/category.schema.js";

const router = express.Router();

router.get("/", getCategories);

router.post(
  "/",
  authorize("OWNER"),
  handleUpload(uploadCategoryImage.single("image")),   // ← wrapped
  validate(createCategorySchema),
  createCategoryController
);

router.patch(
  "/:id/deactivate",
  authorize("OWNER"),
  validate(categoryIdParamSchema, "params"),
  deactivateCategoryController
);

router.patch(
  "/:id/activate",
  authorize("OWNER"),
  validate(categoryIdParamSchema, "params"),
  activateCategoryController
);

router.put(
  "/:id",
  authorize("OWNER"),
  validate(categoryIdParamSchema, "params"),
  handleUpload(uploadCategoryImage.single("image")),   // ← wrapped
  validate(updateCategorySchema),
  updateCategoryController
);


router.delete("/:id", authorize("OWNER"), deleteCategoryController);
export default router;

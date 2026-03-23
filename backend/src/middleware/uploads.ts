import multer from "multer";
import path from "path";
import fs from "fs";
import type { Request } from "express";

// --- 1. Ensure Directories Exist ---
const folders = ["uploads/categories/", "uploads/pricecategories/"];
folders.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// --- 2. Shared Configurations ---
const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!") as any, false);
  }
};

const commonLimits = { fileSize: 2 * 1024 * 1024 }; // 2MB

// Helper to generate unique filenames
const generateFileName = (file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const ext = path.extname(file.originalname);
  cb(null, `${uniqueSuffix}${ext}`);
};

// --- 3. Storage Definitions ---

// Storage for Categories
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/categories/");
  },
  filename: (_req, file, cb) => generateFileName(file, cb),
});

// Storage for Price Categories
const priceCatStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/pricecategories/");
  },
  filename: (_req, file, cb) => generateFileName(file, cb),
});

// --- 4. Exported Multer Instances ---

export const uploadCategoryImage = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: commonLimits,
});

export const uploadPriceCategoryImage = multer({
  storage: priceCatStorage,
  fileFilter: imageFileFilter,
  limits: commonLimits,
});
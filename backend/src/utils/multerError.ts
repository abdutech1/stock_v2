import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const handleUpload = (uploadMiddleware: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: any) => {
      
      if (err instanceof multer.MulterError) {
        let message = "File upload failed";
        let status = 400;

        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            message = "File is too large. Maximum allowed size is 2MB.";
            status = 413; 
            break;
          case "LIMIT_UNEXPECTED_FILE":
            message = "Unexpected file field. Expected 'image'.";
            break;
          default:
            message = err.message || "Invalid file upload";
        }

        return res.status(status).json({
          success: false,
          error: {
            code: err.code,
            message,
            field: "image",
          },
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          error: {
            message: err.message || "File validation failed",
            field: "image",
          },
        });
      }

      next();
    });
  };
};
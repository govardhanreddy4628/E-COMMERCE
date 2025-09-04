// --- src/middleware/errorHandler.ts ---
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  const errors = err instanceof ApiError && err.errors ? err.errors : null;

  console.error("Error:", err);

  const response = new ApiResponse(statusCode, message, { errors });
  return res.status(statusCode).json(response);
  
};




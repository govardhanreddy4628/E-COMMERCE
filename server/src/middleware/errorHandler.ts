// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  const errors = err instanceof ApiError ? err.errors : [];

  if (process.env.NODE_ENV === "DEVELOPMENT") console.error(err);

  res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message, null, errors));
};

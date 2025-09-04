// --- src/middleware/auth.ts ---
import jwt from "jsonwebtoken";
import { RequestHandler } from 'express';
//import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      userId?: String;
      userRole?: string;
    }
  }
}

interface DecodedToken {
  id: string;
  role: string;
}

export const auth = (roles?: string[]): RequestHandler => {
  return (req, res, next) => {
    try {
      console.log(req.cookies);
      const accessToken =
        req.cookies?.accessToken ||
        (req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization.split(" ")[1]
          : null);

      if (!process.env.JWT_ACCESS_SECRET) {
        throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");  
      }

      if (!accessToken) {
        res.status(401).json({ message: "Provide Token" });
        return;
      }
      const decoded = jwt.verify(accessToken,process.env.JWT_ACCESS_SECRET!) as DecodedToken;
      console.log("Decoded Token:", decoded);
      if (!decoded?.id) {
        res.status(401).json({
          message: "unauthorized access",
          error: true,
          success: false,
        })
        return;
      }
      if (roles && !roles.includes(decoded?.role)) {
        throw new ApiError(403, "Forbidden: insufficient role");
      }
      req.userId = decoded.id;
      req.userRole = decoded.role;
      next();
    } catch (error) {
      res.status(500).json({
        message: "you are not logged in",
        error: true,
        success: false,
      });
    }
  };
};



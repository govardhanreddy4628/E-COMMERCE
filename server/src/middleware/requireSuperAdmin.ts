// src/middleware/requireSuperAdmin.ts
import { RequestHandler } from "express";

export const requireSuperAdmin = (): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthenticated" });
      return;
    }

    if (req.user.role !== "SUPER-ADMIN") {
      res.status(403).json({
        message: "Forbidden: Super Admin access required",
      });
      return;
    }

    next();
  };
};

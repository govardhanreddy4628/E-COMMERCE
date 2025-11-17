import { RequestHandler } from "express";

export const authorize = (...allowedRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return; // <-- ensures return type is void
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden: insufficient role" });
      return; // <-- ensures return type is void
    }

    next();
  };
};

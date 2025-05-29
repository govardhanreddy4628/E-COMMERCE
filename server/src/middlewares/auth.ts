// --- src/middleware/auth.ts ---
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/ApiError';

interface Decoded {
  id: string;
  role: string;
}

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new AppError('No token provided', 403);

    try {
      const decoded = jwt.verify(authHeader, process.env.JWT_SECRET!) as Decoded;
      if (!roles.includes(decoded?.role)) {
        throw new AppError('Forbidden: insufficient role', 403);
      }
      req.user = decoded;
      next();
    } catch {
      throw new AppError('Invalid token', 403);
    }
  };
};
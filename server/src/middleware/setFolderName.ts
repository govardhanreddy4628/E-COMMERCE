import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      folder?: string;
    }
  }
}

export const setUploadFolder = (folderName: string) => {
  return (req:Request, res:Response, next:NextFunction) => {
    req.folder = folderName;  
    next();
  };
};

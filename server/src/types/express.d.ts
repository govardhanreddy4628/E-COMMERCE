import "express";

declare global {
  namespace Express {
    interface Request {              // Extend Express Request interface to include 'userId' and 'userRole'
      userId?: string;
      userRole?: string;
    }
  }
}

//it is global type declaration file for express request object so that we can access userId and userRole in req object throughout the project. and we don't have to export it.
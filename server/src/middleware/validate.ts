// // src/middleware/validate.ts
// import { ZodError, ZodObject } from "zod";
// import { Request, Response, NextFunction } from "express";
// import { ApiError } from "../utils/ApiError.js";

// /**
//  * ✅ Universal Zod validation middleware
//  * - Works with req.body, req.params, and req.query
//  * - Integrates with global errorHandler
//  */
// export const validate =
//   (schema: ZodObject<any>) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     try {
//       schema.parse({
//         body: req.body,
//         params: req.params,
//         query: req.query,
//       });
//       next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const formattedErrors = error.issues.map((issue) => ({
//           path: issue.path.join("."),
//           message: issue.message,
//         }));

//         next(new ApiError(400, "Validation failed", formattedErrors));
//       } else {
//         next(error);
//       }
//     }
//   };






// src/middleware/validate.ts
import { ZodError, ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

/**
 * ✅ Smart Zod validation middleware
 * - Works with body, params, and query
 * - Automatically detects what your schema defines
 * - Integrates with global ApiError + errorHandler
 */
export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Detect what parts the schema defines (body, params, query)
      const shapeKeys = Object.keys((schema as any).shape || {});

      // Build the object to validate dynamically
      const dataToValidate: Record<string, any> = {};
      if (shapeKeys.includes("body")) dataToValidate.body = req.body;
      if (shapeKeys.includes("params")) dataToValidate.params = req.params;
      if (shapeKeys.includes("query")) dataToValidate.query = req.query;

    
      // If schema does not have body/params/query wrappers, just validate req.body
      const data = shapeKeys.length ? dataToValidate : req.body;

      // Perform validation
      const parsedData = schema.parse(data);

      // ✅ Replace request data with parsed/sanitized values (optional but recommended)
      if (parsedData.body) req.body = parsedData.body;
      if (parsedData.params) req.params = parsedData.params as import("express-serve-static-core").ParamsDictionary;
      if (parsedData.query) req.query = parsedData.query as any;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        next(new ApiError(400, "Validation failed", formattedErrors));
      } else {
        next(error);
      }
    }
  };

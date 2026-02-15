// validators.ts
import { z, ZodError, ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../middleware/errorHandler.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ A reusable middleware to validate body/params/query
export const validate = (schema: ZodObject) => (req:Request, res:Response, next:NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues ?? [];
        const message =
          issues.map((e) => e.message).join(", ") || "Validation error";
        next(new ApiError(400, message)); 
      } else {
        next(error);
    }
  }
};

  
// ✅ Schemas
export const newGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Please Enter Name"),
    members: z
      .array(z.string())
      .min(2, "Members must be at least 2")
      .max(100, "Members must be at most 100"),
  }),
});

export const addMemberSchema = z.object({
  body: z.object({
    chatId: z.string().min(1, "Please Enter Chat ID"),
    members: z
      .array(z.string())
      .min(1, "Members must be at least 1")
      .max(97, "Members must be at most 97"),
  }),
});

export const removeMemberSchema = z.object({
  body: z.object({
    chatId: z.string().min(1, "Please Enter Chat ID"),
    userId: z.string().min(1, "Please Enter User ID"),
  }),
});

export const sendAttachmentsSchema = z.object({
  body: z.object({
    chatId: z.string().min(1, "Please Enter Chat ID"),
  }),
});

export const chatIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Please Enter Chat ID"),
  }),
});

export const renameSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Please Enter Chat ID"),
  }),
  body: z.object({
    name: z.string().min(1, "Please Enter New Name"),
  }),
});

export const sendRequestSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "Please Enter User ID"),
  }),
});

export const acceptRequestSchema = z.object({
  body: z.object({
    requestId: z.string().min(1, "Please Enter Request ID"),
    accept: z
      .boolean()
      .refine((val) => typeof val === "boolean", {
        message: "Accept must be a boolean",
      }),
  }),
});


export const adminLoginSchema = z.object({
  body: z.object({
    secretKey: z.string().min(1, "Please Enter Secret Key"),
  }),
});
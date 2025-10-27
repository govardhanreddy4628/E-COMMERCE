// validations/question.validation.ts
import { z } from "zod";

export const AnswerValidationSchema = z.object({
  user: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
  answer: z.string().min(2, "Answer must be at least 2 characters long"),
  upvotes: z.number().min(0).optional(),
  downvotes: z.number().min(0).optional(),
});

export const QuestionValidationSchema = z.object({
  product: z.string().regex(/^[a-f\d]{24}$/i, "Invalid product ID"),
  user: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
  question: z.string().min(5, "Question must be at least 5 characters long"),
  answers: z.array(AnswerValidationSchema).optional(),
  isResolved: z.boolean().optional(),
});

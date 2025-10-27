// controllers/question.controller.ts
import { Request, Response } from "express";
import { QuestionValidationSchema } from "../validators/questionsValidation";
import { QuestionModel } from "../models/questionsModel";


// ✅ Ask a Question
export const askQuestion = async (req: Request, res: Response) => {
  try {
    const validated = QuestionValidationSchema.parse(req.body);
    const question = await QuestionModel.create(validated);
    res.status(201).json(question);
  } catch (err: any) {
    res.status(400).json({ error: err.errors || err.message });
  }
};

// ✅ Answer a Question
export const answerQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    const { user, answer } = req.body;

    const question = await QuestionModel.findByIdAndUpdate(
      questionId,
      { $push: { answers: { user, answer } } },
      { new: true }
    );

    if (!question) return res.status(404).json({ error: "Question not found" });

    res.json(question);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Upvote / Downvote Answer
export const voteAnswer = async (req: Request, res: Response) => {
  try {
    const { questionId, answerId } = req.params;
    const { type } = req.body; // "upvote" or "downvote"

    const update = type === "upvote" ? { $inc: { "answers.$.upvotes": 1 } }
                                     : { $inc: { "answers.$.downvotes": 1 } };

    const question = await QuestionModel.findOneAndUpdate(
      { _id: questionId, "answers._id": answerId },
      update,
      { new: true }
    );

    if (!question) return res.status(404).json({ error: "Answer not found" });

    res.json(question);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get Questions for a Product (with pagination)
export const getProductQuestions = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const questions = await QuestionModel.find({ product: productId })
      .populate("user", "name") // show who asked
      .populate("answers.user", "name") // show who answered
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAnswer {
  _id?: Types.ObjectId;
  user: Types.ObjectId;     // who answered (seller / customer)
  answer: string;
  upvotes?: number;
  downvotes?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuestion extends Document {
  product: Types.ObjectId;   // reference to Product
  user: Types.ObjectId;      // who asked
  question: string;
  answers: IAnswer[];
  isResolved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


const AnswerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answer: { type: String, required: true, trim: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const QuestionSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true, minlength: 5, trim: true },
    answers: [AnswerSchema],
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const QuestionModel = mongoose.model("Question", QuestionSchema);

import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  title: String,
  aiSummary: String,
  lastMessageAt: { type: Date, default: Date.now },
  assignedAgentId: { type: mongoose.Types.ObjectId, ref: "User" },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Conversation", ConversationSchema);

import mongoose from "mongoose";

const AssistantMessageSchema  = new mongoose.Schema({
  conversationId: { type: mongoose.Types.ObjectId, ref: "Conversation" },
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  role: { type: String, enum: ["user", "assistant", "agent", "system"], default: "user" },
  text: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});
 
export default mongoose.model("AssistantMessage", AssistantMessageSchema );

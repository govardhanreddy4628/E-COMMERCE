import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({    
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true},
    content: { type: String, trim: true, },
    attachments: [
      {
        public_id: {type: String, required: true},
        url: {type: String, required: true}
      }
    ],
    isOwn: {type: Boolean},
    isRead: {type: Boolean}
  },
  { timestamps: true }
)

export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema)
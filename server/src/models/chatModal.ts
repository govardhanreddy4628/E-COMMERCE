
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, required: true},
        isGroup: {type: Boolean, default: false},
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message"},
        unreadCount: { type: Number, min: 0 },
        isOnline: {type: Boolean, default: false},
    },
    { timestamps: true}
)

const ChatModel = mongoose.model("Chat", chatSchema);
export default ChatModel;
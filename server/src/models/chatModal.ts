//chatName
//isGroupChat
//users
//latestMessage
//groupAdmin


const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
        name: { type: String, trim: true, required: true},
        isGroup: {type: Boolean, default: false},
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message"},
        unreadCount: { type: Number, min: 0 },
        isOnline: {type: Boolean, default: false},
    },
    { timestamps: true}
)

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
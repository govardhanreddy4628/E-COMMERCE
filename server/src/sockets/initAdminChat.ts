import { Namespace, Server, Socket } from "socket.io";
import { Message } from "../models/MessageModel.js";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "../constants/index.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "../lib/helper.js";
import { IUserDocument } from "../models/userModel.js";

interface CustomSocket extends Socket {
  user: IUserDocument;
}

// --- Maps user IDs to socket IDs ---
export const userSocketIDs = new Map<string, string>();
export const onlineUsers = new Set<string>();

export function initAdminChat(io: Namespace) {
  io.on("connection", (socket: Socket) => {
    const customSocket = socket as CustomSocket;
    console.log("🟢 connected successfully", socket.id);

    const user = customSocket.user;

    if (!user || !user?._id) {
      console.warn("⚠️ Connected socket has no user data");
      socket.disconnect(true);
      return;
    }

    console.log(`🟢 User connected: ${user.fullName} (${socket.id})`);
    userSocketIDs.set(user._id.toString(), socket.id);

    // socket.on("sendMessage", async (msg) => {
    //   const saved = await new Message(msg).save();
    //   io.to(msg.receiverId).emit("receiveMessage", saved);
    // });

    // socket.on("message", (msg) => {
    //   console.log("📨 Message received:", msg);
    //   io.emit("message", msg);
    // });

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
      const messageForRealTime = {
        content: message,
        _id: uuid(),
        sender: {
          _id: user._id,
          name: user.fullName,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      const messageForDB = {
        content: message,
        sender: user._id,
        chat: chatId,
      };

      const membersSockets = getSockets(members).filter((id): id is string => typeof id === "string");
      io.to(membersSockets).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealTime,
      });
      io.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId });

      try {
        await Message.create(messageForDB);
      } catch (error: any) {
        console.error("Message saving error:", error);
        io.to(socket.id).emit("error", { message: "Failed to send message" });
      }
    });

    socket.on(START_TYPING, ({ members, chatId }) => {
      const membersSockets = getSockets(members).filter((id): id is string => typeof id === "string");
      socket.to(membersSockets).emit(START_TYPING, { chatId });
    });

    socket.on(STOP_TYPING, ({ members, chatId }) => {
      const membersSockets = getSockets(members).filter((id): id is string => typeof id === "string");
      socket.to(membersSockets).emit(STOP_TYPING, { chatId });
    });

    // socket.on("join", (userId) => {
    //   socket.join(userId);
    // });

    socket.on(CHAT_JOINED, ({ userId, members }) => {
      onlineUsers.add(userId.toString());
      const membersSockets = getSockets(members).filter((id): id is string => typeof id === "string");
      io.to(membersSockets).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on(CHAT_LEAVED, ({ userId, members }) => {
      onlineUsers.delete(userId.toString());
      const membersSockets = getSockets(members).filter((id): id is string => typeof id === "string");
      io.to(membersSockets).emit(ONLINE_USERS, Array.from(onlineUsers));
    });

    socket.on("disconnect", () => {
      console.log("❌ Admin disconnected:", socket.id);
      userSocketIDs.delete(user.id.toString());
      onlineUsers.delete(user.id.toString());
      socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
    });
  });
}

import { Server, Socket } from "socket.io";
import { Message } from "../models/MessageModel";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "../constants";
import { v4 as uuid } from "uuid";
import { getSockets } from "../lib/helper";

export const userSocketIDs = new Map();
export const onlineUsers = new Set();

export function initAdminChat(io: ReturnType<Server["of"]>) {
  io.on("connection", (socket: Socket) => {
    console.log("🟢 connected successfully", socket.id);

    // socket.on("sendMessage", async (msg) => {
    //   const saved = await new Message(msg).save();
    //   io.to(msg.receiverId).emit("receiveMessage", saved);
    // });

    const user = socket.user;
    userSocketIDs.set(user._id.toString(), socket.id);

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
          name: user.name,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      const messageForDB = {
        content: message,
        sender: user._id,
        chat: chatId,
      };

      const membersSocket = getSockets(members);
      io.to(membersSocket).emit(NEW_MESSAGE, {
        chatId,
        message: messageForRealTime,
      });
      io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

      try {
        await Message.create(messageForDB);
      } catch (error) {
        throw new Error(error);
      }
    });
  

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  // socket.on("join", (userId) => {
  //   socket.join(userId);
  // });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });


  socket.on("disconnect", () => {
    console.log("❌ Admin disconnected:", socket.id);
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });

})
};

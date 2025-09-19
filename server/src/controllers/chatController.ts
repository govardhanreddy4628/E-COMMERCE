import { Request, Response } from "express";
import UserModel from "../models/userModel";
const asyncHandler = require("express-async-handler");

export const accessChat = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await UserModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

export const fetchChats = asyncHandler(async (req: Request, res: Response) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserModel.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { users: usersRaw, name } = req.body;

    if (!usersRaw || !name) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Ensure users is an array
    let users: string[];
    try {
      users = typeof usersRaw === "string" ? JSON.parse(usersRaw) : usersRaw;
    } catch {
      return res.status(400).json({ message: "Invalid users format" });
    }

    if (!Array.isArray(users) || users.length < 2) {
      return res
        .status(400)
        .json({
          message: "At least 2 other users are required to form a group chat",
        });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Include creator in group
    users.push(req.userId);

    try {
      const groupChat = await Chat.create({
        chatName: name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.userId,
      });
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })   //or u can use  const fullGroupChat = await Chat.findById(groupChat._id)
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

       if (!fullGroupChat) {
        return res.status(500).json({ message: "Failed to create group chat" });
      }

      // Emit events (via socket/event bus)
      emitEvent(req, "alert", users, `Welcome to ${name} group`);
      emitEvent(req, "refetch_chats", users);

      return res.status(201).json(fullGroupChat);
    } catch (error: any) {
      console.error("Error creating group chat:", error);
      return res.status(500).json({ message: error.message || "Server error" });
    }
  }
);

export const renameGroup = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

export const removeFromGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, userId } = req.body;
    // check if the requester is admin
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  }
);

export const addToGroup = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, userId } = req.body;
  // check if the requester is admin
  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

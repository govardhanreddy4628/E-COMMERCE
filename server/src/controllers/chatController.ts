// src/controllers/chatController.ts
import { Request, Response, RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel";
import Chat from "../models/chatModal";
import ChatModel from "../models/chatModal";
import { Message } from "../models/MessageModel";
import { ApiError } from "../utils/ApiError";

// ---------------- Access / Create One-to-One Chat ----------------
export const accessChat: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with request");
      res.sendStatus(400);
      return;
    }

    let isChat = await ChatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.userId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    // isChat = await UserModel.populate(isChat, {
    //   path: "latestMessage.sender",
    //   select: "name pic email",
    // });

    isChat = await ChatModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.userId, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );

        res.status(200).send(FullChat);
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    }
  }
);

// // ---------------- Fetch All Chats ----------------
// export const fetchChats: RequestHandler = asyncHandler(
//   async (req: Request, res: Response) => {
//     try {
//       const results = await ChatModel.find({
//         users: { $elemMatch: { $eq: req.userId } },
//       })
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password")
//         .populate("latestMessage")
//         .sort({ updatedAt: -1 });

//       const populatedResults = await UserModel.populate(results, {
//         path: "latestMessage.sender",
//         select: "fullName pic email",
//       });

//       res.status(200).send(populatedResults);
//     } catch (error: any) {
//       res.status(400).json({ message: error.message });
//     }
//   }
// );


// const sendAttachments = TryCatch(async (req, res, next) => {
//   const { chatId } = req.body;

//   const files = req.files || [];

//   if (files.length < 1)
//     return next(new ApiError(400, "Please Upload Attachments"));

//   if (files.length > 5)
//     return next(new ApiError(400, "Files Can't be more than 5"));

//   const [chat, me] = await Promise.all([
//     ChatModel.findById(chatId),
//     UserModel.findById(req.user, "fullName"),
//   ]);

//   if (!chat) return next(new ApiError(404, "Chat not found" ));

//   if (files.length < 1)
//     return next(new ApiError(404, "Please provide attachments" ));

//   //   Upload files here
//   const attachments = await uploadFilesToCloudinary(files);

//   const messageForDB = {
//     content: "",
//     attachments,
//     sender: me._id,
//     chat: chatId,
//   };

//   const messageForRealTime = {
//     ...messageForDB,
//     sender: {
//       _id: me._id,
//       name: me.name,
//     },
//   };

//   const message = await Message.create(messageForDB);

//   emitEvent(req, NEW_MESSAGE, chat.members, {
//     message: messageForRealTime,
//     chatId,
//   });

//   emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

//   return res.status(200).json({
//     success: true,
//     message,
//   });
// });



// const getMyChats = TryCatch(async (req, res, next) => {
//   const chats = await ChatModel.find({ members: req.user }).populate(
//     "members",
//     "name avatar"
//   );

//   const transformedChats = chats.map(({ _id, name, members, isGroup }) => {
//     const otherMember = getOtherMember(members, req.user);

//     return {
//       _id,
//       isGroup,
//       avatar: isGroup
//         ? members.slice(0, 3).map(({ avatar }) => avatar.url)
//         : [otherMember.avatar.url],
//       name: isGroup ? name : otherMember.name,
//       members: members.reduce((prev, curr) => {
//         if (curr._id.toString() !== req.user.toString()) {
//           prev.push(curr._id);
//         }
//         return prev;
//       }, []),
//     };
//   });

//   return res.status(200).json({
//     success: true,
//     chats: transformedChats,
//   });
// });

// const getMyGroups = TryCatch(async (req, res, next) => {
//   const chats = await ChatModel.find({
//     members: req.user,
//     isGroup: true,
//     groupAdmin: req.user,
//   }).populate("members", "name avatar");

//   const groups = chats.map(({ members, _id, isGroup, name }) => ({
//     _id,
//     isGroup,
//     name,
//     avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
//   }));

//   return res.status(200).json({
//     success: true,
//     groups,
//   });
// });



// const getChatDetails = TryCatch(async (req, res, next) => {
//   if (req.query.populate === "true") {
//     const chat = await ChatModel.findById(req.params.id)
//       .populate("members", "name avatar")
//       .lean();

//     if (!chat) return next(new ApiError(404, "Chat not found"));

//     chat.members = chat.members.map(({ _id, name, avatar }) => ({
//       _id,
//       name,
//       avatar: avatar.url,
//     }));

//     return res.status(200).json({
//       success: true,
//       chat,
//     });
//   } else {
//     const chat = await ChatModel.findById(req.params.id);
//     if (!chat) return next(new ApiError(404, "Chat not found"));

//     return res.status(200).json({
//       success: true,
//       chat,
//     });
//   }
// });


// const getMessages = TryCatch(async (req, res, next) => {
//   const chatId = req.params.id;
//   const { page = 1 } = req.query;

//   const resultPerPage = 20;
//   const skip = (page - 1) * resultPerPage;

//   const chat = await ChatModel.findById(chatId);

//   if (!chat) return next(new ApiError(404, "Chat not found"));

//   if (!chat.members.includes(req.user.toString()))
//     return next(
//       new ApiError(403, "You are not allowed to access this chat")
//     );

//   const [messages, totalMessagesCount] = await Promise.all([
//     Message.find({ chat: chatId })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(resultPerPage)
//       .populate("sender", "name")
//       .lean(),
//     Message.countDocuments({ chat: chatId }),
//   ]);

//   const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

//   return res.status(200).json({
//     success: true,
//     messages: messages.reverse(),
//     totalPages,
//   });
// });



// const deleteChat = TryCatch(async (req, res, next) => {
//   const chatId = req.params.id;

//   const chat = await ChatModel.findById(chatId);

//   if (!chat) return next(new ApiError(404, "Chat not found"));

//   const members = chat.members;

//   if (chat.isGroup && chat.groupAdmin.toString() !== req.user.toString())
//     return next(
//       new ApiError(403, "You are not allowed to delete the group")
//     );

//   if (!chat.isGroup && !chat.members.includes(req.user.toString())) {
//     return next(
//       new ApiError(403, "You are not allowed to delete the chat")
//     );
//   }

//   //   Here we have to dete All Messages as well as attachments or files from cloudinary

//   const messagesWithAttachments = await Message.find({
//     chat: chatId,
//     attachments: { $exists: true, $ne: [] },
//   });

//   const public_ids = [];

//   messagesWithAttachments.forEach(({ attachments }) =>
//     attachments.forEach(({ public_id }) => public_ids.push(public_id))
//   );

//   await Promise.all([
//     deletFilesFromCloudinary(public_ids),
//     chat.deleteOne(),
//     Message.deleteMany({ chat: chatId }),
//   ]);

//   emitEvent(req, REFETCH_CHATS, members);

//   return res.status(200).json({
//     success: true,
//     message: "Chat deleted successfully",
//   });
// });



// ---------------- Create Group Chat ----------------
export const createGroupChat: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { members: usersRaw, name } = req.body;

    if (!usersRaw || !name) {
      res.status(400).json({ message: "Please fill all the fields" });
      return;
    }

    let members: string[];
    try {
      members = typeof usersRaw === "string" ? JSON.parse(usersRaw) : usersRaw;
    } catch {
      res.status(400).json({ message: "Invalid users format" });
      return;
    }

    if (!Array.isArray(members) || members.length < 2) {
      res.status(400).json({
        message: "At least 2 other users are required to form a group chat",
      });
      return;
    }

    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const allMembers = [...members, req.userId];

    try {
      const isGroup = await ChatModel.create({
        chatName: name,
        members: allMembers,
        isGroupChat: true,
        groupAdmin: req.userId,
      });

      const fullGroupChat = await ChatModel.findById(isGroup._id)
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      if (!fullGroupChat) {
        res.status(500).json({ message: "Failed to create group chat" });
        return;
      }

      res.status(201).json(fullGroupChat);
    } catch (error: any) {
      console.error("Error creating group chat:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  }
);

// // ---------------- Rename Group ----------------
// export const renameGroup: RequestHandler = asyncHandler(
//   async (req: Request, res: Response) => {
//     const chatId = req.params.id;
//     const { name } = req.body;

//     const chat = await ChatModel.findById(chatId);

//     if (!chat) return next(new ApiError(404, "Chat not found"));

//     if (!chat.isGroup)
//       return next(new ApiError(400, "This is not a group chat"));

//     if (chat.groupAdmin.toString() !== req.user.toString())
//       return next(
//         new ApiError(403, "You are not allowed to rename the group")
//       );

//     chat.name = name;

//     await chat.save();

//     emitEvent(req, REFETCH_CHATS, chat.members);

//     return res.status(200).json({
//       success: true,
//       message: "Group renamed successfully",
//     });
//   }
// );

// // ---------------- Remove From Group ----------------
// export const removeFromGroup: RequestHandler = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { chatId, userId } = req.body;

//     const [chat, userThatWillBeRemoved] = await Promise.all([
//       ChatModel.findById(chatId),
//       UserModel.findById(userId, "fullName"),
//     ]);

//     if (!chat) return next(new ApiError(404, "Chat not found"));

//     if (!chat.isGroup)
//       return next(new ApiError(400, "This is not a group chat"));

//     if (chat.groupAdmin.toString() !== req.user.toString())
//       return next(new ApiError(403, "You are not allowed to add members"));

//     if (chat.members.length <= 3)
//       return next(new ApiError(400, "Group must have at least 3 members"));

//     const allChatMembers = chat.members.map((i) => i.toString());

//     chat.members = chat.members.filter(
//       (member) => member.toString() !== userId.toString()
//     );

//     await chat.save();

//     emitEvent(req, ALERT, chat.members, {
//       message: `${userThatWillBeRemoved.name} has been removed from the group`,
//       chatId,
//     });

//     emitEvent(req, REFETCH_CHATS, allChatMembers);

//     return res.status(200).json({
//       success: true,
//       message: "Member removed successfully",
//     });
//   }
// );

// // ---------------- Add To Group ----------------
// export const addToGroup: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
//     const { chatId, members } = req.body;

//   const chat = await ChatModel.findById(chatId);

//   if (!chat) return next(new ApiError("Chat not found", 404));

//   if (!chat.isGroup)
//     return next(new ApiError("This is not a group chat", 400));

//   if (chat.groupAdmin.toString() !== req.user.toString())
//     return next(new ApiError("You are not allowed to add members", 403));

//   const allNewMembersPromise = members.map((i) => UserModel.findById(i, "name"));

//   const allNewMembers = await Promise.all(allNewMembersPromise);

//   const uniqueMembers = allNewMembers
//     .filter((i) => !chat.members.includes(i._id.toString()))
//     .map((i) => i._id);

//   chat.members.push(...uniqueMembers);

//   if (chat.members.length > 100)
//     return next(new ApiError("Group members limit reached", 400));

//   await chat.save();

//   const allUsersName = allNewMembers.map((i) => i.name).join(", ");

//   emitEvent(
//     req,
//     ALERT,
//     chat.members,
//     `${allUsersName} has been added in the group`
//   );

//   emitEvent(req, REFETCH_CHATS, chat.members);

//   return res.status(200).json({
//     success: true,
//     message: "Members added successfully",
//   });
// });



// const leaveGroup = TryCatch(async (req, res, next) => {
//   const chatId = req.params.id;

//   const chat = await ChatModel.findById(chatId);

//   if (!chat) return next(new ApiError(404, "Chat not found"));

//   if (!chat.isGroup)
//     return next(new ApiError(400, "This is not a group chat"));

//   const remainingMembers = chat.members.filter(
//     (member) => member.toString() !== req.user.toString()
//   );

//   if (remainingMembers.length < 3)
//     return next(new ApiError(400, "Group must have at least 3 members"));

//   if (chat.groupAdmin.toString() === req.user.toString()) {
//     const randomElement = Math.floor(Math.random() * remainingMembers.length);
//     const newGroupAdmin = remainingMembers[randomElement];
//     chat.groupAdmin = newGroupAdmin;
//   }

//   chat.members = remainingMembers;

//   const [user] = await Promise.all([
//     UserModel.findById(req.user, "fullName"),
//     chat.save(),
//   ]);

//   emitEvent(req, ALERT, chat.members, {
//     chatId,
//     message: `User ${user.fullName} has left the group`,
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Leave Group Successfully",
//   });
// });


// const searchUser = TryCatch(async (req, res) => {
//   const { name = "" } = req.query;

//   // Finding All my chats
//   const myChats = await ChatModel.find({ isGroup: false, members: req.user });

//   //  extracting All Users from my chats means friends or people I have chatted with
//   const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

//   // Finding all users except me and my friends
//   const allUsersExceptMeAndFriends = await UserModel.find({
//     _id: { $nin: allUsersFromMyChats },
//     name: { $regex: name, $options: "i" },
//   });

//   // Modifying the response
//   const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
//     _id,
//     name,
//     avatar: avatar.url,
//   }));

//   return res.status(200).json({
//     success: true,
//     users,
//   });
// });

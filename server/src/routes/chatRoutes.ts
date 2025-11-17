import express from "express";
import { auth } from "../middleware/authenticate.js";
import { accessChat, createGroupChat } from "../controllers/chatController.js";
//import upload from "../middleware/multer";

const chatRouter = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

chatRouter.use(auth(["user"]));

chatRouter.route("/").post(accessChat);
// chatRouter.route("/").get(fetchChats);
chatRouter.route("/newgroup").post(createGroupChat);
// chatRouter.route("/rename").put(renameGroup);
// chatRouter.route("/groupremove").put(removeFromGroup);
// chatRouter.route("/groupadd").put(addToGroup);

// Send Attachments
//chatRouter.post("/message", upload.array(), sendAttachmentsValidator(), validateHandler, sendAttachments);

export default chatRouter;

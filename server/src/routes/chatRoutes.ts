import express from "express";
import { auth } from "../middleware/auth";
import { accessChat } from "../controllers/chatController";

const chatRouter = express.Router();

chatRouter.route("/").post(auth, accessChat);
chatRouter.route("/").get(auth, fetchChat);
chatRouter.route("/newgroup").post(auth, createGroupChat);
chatRouter.route("/rename").put(auth, renameGroup);
chatRouter.route("/groupremove").put(auth, removeFromGroup);
chatRouter.route("/groupadd").put(auth, addToGroup);

export default chatRouter;
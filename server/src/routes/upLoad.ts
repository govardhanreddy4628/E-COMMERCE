import {Router} from "express";
import { uploadImages } from "../controllers/uploadController";

const uploadRouter = Router();
// Define the route for uploading images
uploadRouter.post("/upload1", uploadImages);
export default uploadRouter;
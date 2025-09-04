"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const uploadRouter = (0, express_1.Router)();
// Define the route for uploading images
uploadRouter.post("/upload1", uploadController_1.uploadImages);
exports.default = uploadRouter;

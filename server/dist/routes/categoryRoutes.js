"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const categoryRouter = (0, express_1.Router)();
//categoryRouter.post('/createCategory', authorize, upload.array('images'), createCategoryController)
categoryRouter.get("/getAllCategory", categoryController_1.getAllCategoryController);
categoryRouter.get("/getSingleCategoryById/:id", categoryController_1.getSingleCategoryByIdController);
exports.default = categoryRouter;
//categoryRouter.get('/', fetchCategories).post('/',createCategory)     *you can define routes like this also

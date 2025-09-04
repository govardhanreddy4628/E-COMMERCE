"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_js_1 = require("../utils/ApiError.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof ApiError_js_1.ApiError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    const errors = err instanceof ApiError_js_1.ApiError && err.errors ? err.errors : null;
    console.error("Error:", err);
    const response = new ApiResponse_js_1.ApiResponse(statusCode, message, { errors });
    return res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// --- src/middleware/auth.ts ---
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const auth = (roles) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader)
            throw new ApiError_1.ApiError(403, 'No token provided');
        try {
            const decoded = jsonwebtoken_1.default.verify(authHeader, process.env.JWT_SECRET);
            if (!roles.includes(decoded === null || decoded === void 0 ? void 0 : decoded.role)) {
                throw new ApiError_1.ApiError(403, 'Forbidden: insufficient role');
            }
            req.user = decoded;
            next();
        }
        catch (_a) {
            throw new ApiError_1.ApiError(403, 'Invalid token');
        }
    };
};
exports.auth = auth;

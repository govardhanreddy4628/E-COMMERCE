// --- src/middleware/socketAuthenticator.ts ---
import jwt from "jsonwebtoken";
import { Socket, ExtendedError } from "socket.io";
import cookie from "cookie";
import UserModel from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";

interface DecodedToken {
  id: string;
  role?: string;
}

export const socketAuthenticator = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    // Parse cookies from the WebSocket handshake headers
    const cookieHeader = socket.request.headers.cookie || "";
    const cookies = cookie.parse(cookieHeader);

    // ✅ Use same cookie name as your HTTP middleware
    const accessToken = cookies?.accessToken;

    if (!accessToken) {
      return next(new ApiError(401, "Please login to access this route"));
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      throw new Error("JWT_ACCESS_SECRET not defined");
    }

    // Verify JWT
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as DecodedToken;

    if (!decoded?.id) {
      return next(new ApiError(401, "Invalid or expired token"));
    }

    // Fetch user from DB
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    // Attach user to socket for later use
    (socket as any).user = user;

    next();
  } catch (error: any) {
    console.error("Socket auth error:", error.message || error);
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token expired"));
    }
    next(new ApiError(401, "Please login to access this route"));
  }
};

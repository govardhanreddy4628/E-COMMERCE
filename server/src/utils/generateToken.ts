// utils/token.ts
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const ACCESS_EXPIRES_SEC = 15 * 60; // 15 minutes
export const REFRESH_EXPIRES_SEC = 7 * 24 * 60 * 60; // 7 days
export const ABSOLUTE_SESSION_SEC = 30 * 24 * 60 * 60; // 30 days

export function generateAccessToken(userId: string, role: string) {
  return jwt.sign({ id: userId, role }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: `${ACCESS_EXPIRES_SEC}s`,
  });
}

/**
 * Returns { token, sid } where:
 * - token is the JWT given to client
 * - sid is a session id embedded in the token payload for server-side mapping
 */
export function generateRefreshToken(userId: string) {
  const sid = uuidv4(); // session id
  const token = jwt.sign({ id: userId, sid }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: `${REFRESH_EXPIRES_SEC}s`,
  });
  return { token, sid };
}

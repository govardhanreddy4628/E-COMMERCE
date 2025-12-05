// import { Request, Response } from "express";
// import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/token";
// import speakeasy from "speakeasy";
// import { googleClient } from "../config/googleOauth.js";
// import UserModel from "../models/userModel.js";

// export const googleRedirect = (_req: Request, res: Response) => {
//   const url = googleClient.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent",
//     scope: ["openid", "profile", "email"]
//   });
//   res.redirect(url);
// };

// export const googleCallback = async (req: Request, res: Response) => {
//   try {
//     const code = req.query.code as string;
//     if (!code) return res.status(400).send("Code missing");
//     const { tokens } = await googleClient.getToken(code);
//     const ticket = await googleClient.verifyIdToken({ idToken: tokens.id_token!, audience: process.env.GOOGLE_CLIENT_ID });
//     const payload = ticket.getPayload();
//     if (!payload || !payload.email) return res.status(400).send("No Google email");

//     const email = payload.email;
//     const name = payload.name || "NoName";
//     const picture = payload.picture || null;
//     const googleId = payload.sub;

//     let user = await UserModel.findOne({ email });
//     if (!user) {
//       user = await UserModel.create({ fullName: name, email, avatar: picture, googleId, isEmailVerified: true });
//     } else {
//       if (!user.googleId) { user.googleId = googleId; if (!user.avatar && picture) user.avatar = picture; await user.save(); }
//     }

//     // If MFA enabled -> create short ticket to verify MFA
//     if (user.mfa?.enabled) {
//       // short-lived ticket with mfa: true
//       const ticketToken = createAccessToken({ id: user._id, mfa: true, purpos: "mfa_ticket" });
//       return res.redirect(`${process.env.FRONTEND_URL}/auth/mfa?ticket=${ticketToken}`);
//     }

//     // issue tokens
//     const accessToken = createAccessToken({ id: user._id });
//     const refreshToken = createRefreshToken({ id: user._id });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       path: "/api/v1/auth/refresh",
//       maxAge: 7*24*60*60*1000
//     });

//     return res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${accessToken}`);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send("Google error");
//   }
// };

// export const refreshAccessToken = (req: Request, res: Response) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.status(401).json({ message: "No refresh token" });
//     const decoded = verifyRefreshToken(token) as any;
//     const accessToken = createAccessToken({ id: decoded.id });
//     return res.json({ accessToken });
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid refresh token" });
//   }
// };

// // verify MFA login ticket (from google or password login)
// export const verifyMfaLogin = async (req: Request, res: Response) => {
//   try {
//     const { ticket, token, backupCode } = req.body as { ticket?: string; token?: string; backupCode?: string };
//     if (!ticket) return res.status(400).json({ message: "Missing ticket" });

//     const jwt = require("jsonwebtoken");
//     let decoded: any;
//     try { decoded = jwt.verify(ticket, process.env.ACCESS_TOKEN_SECRET!); } catch (e) { return res.status(400).json({ message: "Invalid/expired ticket" }); }
//     const userId = decoded.id;
//     const user = await UserModel.findById(userId);
//     if (!user) return res.status(400).json({ message: "User not found" });

//     if (backupCode) {
//       const hash = require("crypto").createHash("sha256").update(backupCode).digest("hex");
//       const idx = (user?.mfa?.backupCodes || []).indexOf(hash);
//       if (idx === -1) return res.status(400).json({ message: "Invalid backup code" });
//       user?.mfa?.backupCodes!.splice(idx, 1);
//       await user.save();
//     } else {
//       const ok = speakeasy.totp.verify({ secret: user?.mfa?.secret!, encoding: "base32", token, window: 1 });
//       if (!ok) return res.status(400).json({ message: "Invalid MFA token" });
//     }

//     // success -> issue tokens
//     const accessToken = createAccessToken({ id: user._id });
//     const refreshToken = createRefreshToken({ id: user._id });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       path: "/api/v1/auth/refresh",
//       maxAge: 7*24*60*60*1000
//     });

//     return res.json({ accessToken });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

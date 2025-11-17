//src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IMfa {
  enabled: boolean;
  secret?: string | null;
  backupCodes?: string[]; // hashed
  verified?: boolean;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string | null;
  avatar?: string | null;
  googleId?: string | null;
  isEmailVerified: boolean;
  mfa: IMfa;
}

const MfaSchema = new Schema<IMfa>({
  enabled: { type: Boolean, default: false },
  secret: { type: String, default: null },
  backupCodes: [{ type: String }],
  verified: { type: Boolean, default: false }
});

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  avatar: { type: String, default: null },
  googleId: { type: String, default: null },
  isEmailVerified: { type: Boolean, default: false },
  mfa: { type: MfaSchema, default: () => ({}) }
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);



//src/utils/token.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createAccessToken = (payload: object) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });

export const createRefreshToken = (payload: object) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);



//src/contollers/authcontroller.ts
import { Request, Response } from "express";
import { googleClient } from "../config/googleOAuth";
import User from "../models/User";
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/token";
import speakeasy from "speakeasy";

export const googleRedirect = (_req: Request, res: Response) => {
  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["openid", "profile", "email"]
  });
  res.redirect(url);
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("Code missing");
    const { tokens } = await googleClient.getToken(code);
    const ticket = await googleClient.verifyIdToken({ idToken: tokens.id_token!, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) return res.status(400).send("No Google email");

    const email = payload.email;
    const name = payload.name || "NoName";
    const picture = payload.picture || null;
    const googleId = payload.sub;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ fullName: name, email, avatar: picture, googleId, isEmailVerified: true });
    } else {
      if (!user.googleId) { user.googleId = googleId; if (!user.avatar && picture) user.avatar = picture; await user.save(); }
    }

    // If MFA enabled -> create short ticket to verify MFA
    if (user.mfa?.enabled) {
      // short-lived ticket with mfa: true
      const ticketToken = createAccessToken({ id: user._id, mfa: true, purpos: "mfa_ticket" });
      return res.redirect(`${process.env.FRONTEND_URL}/auth/mfa?ticket=${ticketToken}`);
    }

    // issue tokens
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/v1/auth/refresh",
      maxAge: 7*24*60*60*1000
    });

    return res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${accessToken}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Google error");
  }
};

export const refreshAccessToken = (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });
    const decoded = verifyRefreshToken(token) as any;
    const accessToken = createAccessToken({ id: decoded.id });
    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

// verify MFA login ticket (from google or password login)
export const verifyMfaLogin = async (req: Request, res: Response) => {
  try {
    const { ticket, token, backupCode } = req.body as { ticket?: string; token?: string; backupCode?: string };
    if (!ticket) return res.status(400).json({ message: "Missing ticket" });

    const jwt = require("jsonwebtoken");
    let decoded: any;
    try { decoded = jwt.verify(ticket, process.env.ACCESS_TOKEN_SECRET!); } catch (e) { return res.status(400).json({ message: "Invalid/expired ticket" }); }
    const userId = decoded.id;
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    if (backupCode) {
      const hash = require("crypto").createHash("sha256").update(backupCode).digest("hex");
      const idx = (user.mfa.backupCodes || []).indexOf(hash);
      if (idx === -1) return res.status(400).json({ message: "Invalid backup code" });
      user.mfa.backupCodes!.splice(idx, 1);
      await user.save();
    } else {
      const ok = speakeasy.totp.verify({ secret: user.mfa.secret!, encoding: "base32", token, window: 1 });
      if (!ok) return res.status(400).json({ message: "Invalid MFA token" });
    }

    // success -> issue tokens
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/v1/auth/refresh",
      maxAge: 7*24*60*60*1000
    });

    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};




//src/controllers/userController.ts
import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../utils/token";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import crypto from "crypto";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) return res.status(400).json({ msg: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);
    const avatar = (req as any).file ? (req as any).file.path : null;
    const user = await User.create({ fullName, email, password: hashed, avatar, isEmailVerified: false });

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", path: "/api/v1/auth/refresh", maxAge: 7*24*60*60*1000 });
    return res.json({ message: "Registered", accessToken });
  } catch (err) { console.error(err); return res.status(500).json({ msg: "Server error" }); }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (user.mfa?.enabled) {
      const ticket = createAccessToken({ id: user._id, mfa: true, purpos: "mfa_ticket" });
      return res.json({ message: "MFA_REQUIRED", ticket });
    }

    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", path: "/api/v1/auth/refresh", maxAge: 7*24*60*60*1000 });
    return res.json({ message: "Login successful", accessToken });
  } catch (err) { console.error(err); return res.status(500).json({ message: "Server error" }); }
};

export const me = async (req: any, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "No auth" });
    const token = auth.split(" ")[1];
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    const user = await User.findById((decoded as any).id).select("-password -mfa.secret");
    return res.json({ user });
  } catch (err) { return res.status(401).json({ message: "Invalid token" }); }
};

// MFA: generate secret and return QR/base32
export const mfaGenerate = async (req: any, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "No auth" });
    const token = auth.split(" ")[1];
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    const user = await User.findById((decoded as any).id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const secret = speakeasy.generateSecret({ name: `YourApp (${user.email})` });
    user.mfa.secret = secret.base32;
    user.mfa.verified = false;
    await user.save();

    const qr = await qrcode.toDataURL(secret.otpauth_url || "");
    return res.json({ otpauth_url: secret.otpauth_url, base32: secret.base32, qr });
  } catch (err) { console.error(err); return res.status(500).json({ message: "Server error" }); }
};

export const mfaVerifySetup = async (req: any, res: Response) => {
  try {
    const { token } = req.body;
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "No auth" });
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(auth.split(" ")[1], process.env.ACCESS_TOKEN_SECRET!);
    const user = await User.findById((decoded as any).id);
    if (!user || !user.mfa.secret) return res.status(400).json({ message: "No setup in progress" });

    const ok = speakeasy.totp.verify({ secret: user.mfa.secret!, encoding: "base32", token, window: 1 });
    if (!ok) return res.status(400).json({ message: "Invalid token" });

    const codes = Array.from({ length: 10 }, () => crypto.randomBytes(4).toString("hex"));
    const hashed = codes.map(c => crypto.createHash("sha256").update(c).digest("hex"));

    user.mfa.enabled = true; user.mfa.verified = true; user.mfa.backupCodes = hashed;
    await user.save();
    return res.json({ message: "MFA enabled", backupCodes: codes });
  } catch (err) { console.error(err); return res.status(500).json({ message: "Server error" }); }
};

export const mfaDisable = async (req: any, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "No auth" });
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(auth.split(" ")[1], process.env.ACCESS_TOKEN_SECRET!);
    const user = await User.findById((decoded as any).id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.mfa = { enabled: false, secret: null, backupCodes: [], verified: false };
    await user.save();
    return res.json({ message: "MFA disabled" });
  } catch (err) { console.error(err); return res.status(500).json({ message: "Server error" }); }
};





src/routes/authRoutes.ts
import express from "express";
import { googleRedirect, googleCallback, refreshAccessToken, verifyMfaLogin } from "../controllers/authController";
const router = express.Router();
router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);
router.post("/refresh", refreshAccessToken);
router.post("/mfa/verify-login", verifyMfaLogin);
export default router;



src/routes/userRoutes.ts
import express from "express";
import { register, login, me, mfaGenerate, mfaVerifySetup, mfaDisable } from "../controllers/userController";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", me);
router.post("/mfa/generate", mfaGenerate);
router.post("/mfa/verify-setup", mfaVerifySetup);
router.post("/mfa/disable", mfaDisable);
export default router;



src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

type User = null | { _id: string; fullName: string; email: string; avatar?: string };
const API_BASE = import.meta.env.VITE_BACKEND_URL_LOCAL || "http://localhost:8080";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);

  const fetchUser = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/user/me`, { headers: { Authorization: `Bearer ${accessToken}` }, credentials: "include" });
      if (!res.ok) throw new Error("fetch user failed");
      const data = await res.json();
      setUser(data.user);
    } catch {
      await tryRefresh();
    }
  };

  const tryRefresh = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, { method: "POST", credentials: "include" });
      if (!res.ok) { setAccessToken(null); setUser(null); return false; }
      const data = await res.json();
      setAccessToken(data.accessToken);
      return true;
    } catch { setAccessToken(null); setUser(null); return false; }
  };

  useEffect(() => { if (accessToken) fetchUser(); }, [accessToken]);

  useEffect(() => { (async () => { await tryRefresh(); })(); }, []);

  const logout = async () => {
    await fetch(`${API_BASE}/api/v1/auth/logout`, { method: "POST", credentials: "include" });
    setAccessToken(null); setUser(null);
  };

  return <AuthContext.Provider value={{ user, accessToken, setAccessToken, fetchUser, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};





import { useToast } from "../../../hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Switch } from "../../../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../ui/dialog";

import { useAuth } from "../../../context/AuthContext";

const AdminSettings = () => {
  const { toast } = useToast();
  const API_BASE = import.meta.env.VITE_BACKEND_URL_LOCAL || "http://localhost:8080";
  const { accessToken } = useAuth();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // MFA setup state
  const [showEnableDialog, setShowEnableDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // On page load → fetch MFA status
  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_BASE}/api/v1/user/mfa/status`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const data = await res.json();
      setTwoFactorEnabled(data.enabled);
    })();
  }, []);

  // --- ENABLE 2FA FLOW ---
  const handleEnable2FA = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/user/mfa/generate`, {
        method: "POST",
        credentials: "include",
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setQrCodeUrl(data.qr);
      setSecret(data.base32);
      setShowEnableDialog(true);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate QR code.",
        variant: "destructive",
      });
    }
  };

  // Verify setup → backend
  const handleVerifyCode = async () => {
    setIsVerifying(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/user/mfa/verify-setup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token: verificationCode })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTwoFactorEnabled(true);
      setShowEnableDialog(false);
      setVerificationCode("");

      toast({
        title: "2FA Enabled",
        description: "Store your backup codes safely:\n" + data.backupCodes.join(", "),
      });
    } catch (err: any) {
      toast({
        title: "Invalid Code",
        description: err.message || "Wrong authenticator code.",
        variant: "destructive",
      });
    }

    setIsVerifying(false);
  };

  // --- DISABLE 2FA FLOW ---
  const handleDisable2FA = async () => {
    setIsVerifying(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/user/mfa/disable`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ token: verificationCode })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTwoFactorEnabled(false);
      setShowDisableDialog(false);
      setVerificationCode("");

      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication is turned off.",
      });
    } catch (err: any) {
      toast({
        title: "Invalid Code",
        description: err.message || "Wrong authenticator code.",
        variant: "destructive",
      });
    }

    setIsVerifying(false);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    toast({
      title: "Copied",
      description: "Secret key copied.",
    });
  };

  const handle2FAToggle = (checked: boolean) => {
    if (checked) handleEnable2FA();
    else setShowDisableDialog(true);
  };

  const handleSave = () => {
    toast({
      title: "Saved",
      description: "Settings saved.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* ---- Other settings preserved ---- */}

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Switch checked={twoFactorEnabled} onCheckedChange={handle2FAToggle} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save All Settings</Button>
          </div>
        </div>
      </div>

      {/* ENABLE MFA MODAL */}
      <Dialog open={showEnableDialog} onOpenChange={setShowEnableDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>Scan the QR code using Google Authenticator.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center p-4 bg-muted rounded-lg">
              {qrCodeUrl && <img src={qrCodeUrl} className="w-48 h-48" />}
            </div>

            <div className="space-y-2">
              <Label>Secret Key:</Label>
              <div className="flex items-center gap-2">
                <Input value={secret} readOnly />
                <Button size="icon" variant="outline" onClick={copySecret}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Enter 6-digit code</Label>
              <Input
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnableDialog(false)}>Cancel</Button>
            <Button disabled={isVerifying || verificationCode.length !== 6} onClick={handleVerifyCode}>
              {isVerifying ? "Verifying..." : "Verify & Enable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DISABLE MFA MODAL */}
      <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>Enter 6-digit authenticator code.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisableDialog(false)}>Cancel</Button>
            <Button variant="destructive" disabled={isVerifying || verificationCode.length !== 6} onClick={handleDisable2FA}>
              {isVerifying ? "Verifying..." : "Disable 2FA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSettings;

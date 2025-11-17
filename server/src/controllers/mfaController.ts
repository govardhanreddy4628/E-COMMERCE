// controllers/twofaController.ts
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import UserModel from "../models/userModel.js";
import { Request, Response } from "express";

export const enableMFA = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await UserModel.findById(req.user._id);

    if (!user) return res.status(404).json({ error: "User not found" });

     // Ensure mfa object exists. because we had mfa as optional parameter in mongoose schema this can be undefined. so make mfa exist when it is undefined.
    if (!user.mfa) {
      user.mfa = { enabled: false, secret: null, verified: false, backupCodes: [] };
    }

    if (user.mfa?.enabled) {
      return res.status(400).json({ error: "MFA already enabled" });
    }

    // 1. Generate secret for this user
    const secret = speakeasy.generateSecret({
      name: `Admin Panel (${user?.email})`, // shows in Google Authenticator
      length: 20, // good default
    });

    // 2. Convert otpauth URL → QR image
    if (!secret.otpauth_url) {
      return res.status(500).json({ error: "Failed to generate otpauth URL" });
    }
    const qrCode = await qrcode.toDataURL(secret?.otpauth_url);

    // Save secret temporarily until user verifies OTP
    user.tempMFASecret = secret.base32;
    user.mfa.verified = false;

    await user.save();

    return res.json({
      qrCode,
      secret: secret.base32,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate MFA" });
  }
};

export const verifyMFA = async (req: Request, res: Response) => {
  try {
    const { otp } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await UserModel.findById(req.user._id).select("+tempMFASecret");

    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.tempMFASecret) {
      return res.status(400).json({ error: "No MFA setup initiated" });
    }

    // Verify OTP
    const verified = speakeasy.totp.verify({
      secret: user.tempMFASecret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Ensure mfa object exists
    if (!user.mfa) {
      user.mfa = { enabled: false, secret: null, verified: false, backupCodes: [] };
    }

    // Move secret to permanent storage
    user.mfa.enabled = true;
    user.mfa.secret = user.tempMFASecret;
    user.mfa.verified = true;
    user.mfa.backupCodes = []; // can add generation later

    user.tempMFASecret = null;

    await user.save();

    return res.json({ success: true, message: "MFA enabled successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
};




export const disableMFA = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await UserModel.findById(req.user._id);

    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.mfa?.enabled) {
      return res.status(400).json({ error: "MFA is not enabled" });
    }

    user.mfa = {
      enabled: false,
      secret: null,
      verified: false,
      backupCodes: [],
    };

    user.tempMFASecret = null;

    await user.save();

    return res.json({ success: true, message: "MFA disabled successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to disable MFA" });
  }
};

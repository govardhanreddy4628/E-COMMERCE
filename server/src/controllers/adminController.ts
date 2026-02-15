import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import UserModel from "../models/userModel.js";
import { createAdminInvite, getInvite, markInviteUsed } from "../services/inviteService.js";
import redisClient from "../config/connectRedis.js";
import { adminInviteKey } from "../redis/keys/invite.keys.js";
import { sendEmailUsingResend } from "../utils/sendEmailUsingResend.js";


export async function inviteAdminController(
  req: Request,
  res: Response
) {
  const { email, role } = req.body;

  if (!email || !["ADMIN", "VENDOR"].includes(role)) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const existing = await UserModel.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const token = await createAdminInvite({
    email,
    role,
    invitedBy: req.user!.id,
  });

  const inviteUrl = `${process.env.FRONTEND_URL}/admin/signup?token=${token}`;

  await sendEmailUsingResend({
    to: email,
    subject: "Admin Invitation",
    html: `
      <div style="font-family: Arial">
        <h2>You are invited as ${role}</h2>
        <p>Click below to complete your registration:</p>
        <a href="${inviteUrl}" target="_blank">Accept Invite</a>
        <p>This link expires in 30 minutes.</p>
      </div>
    `,
  });

  // AUDIT
  console.log("AUDIT_INVITE_SENT", {
    email,
    role,
    invitedBy: req.user!.id,
  });

  return res.status(200).json({ success: true });
}



export async function acceptInviteController(
  req: Request,
  res: Response
) {
  const { token, password, fullName } = req.body;

  const invite = await getInvite(token);
  if (!invite) {
    return res.status(401).json({ message: "Invite expired or invalid" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await UserModel.create({
    email: invite.email,
    password: hashedPassword,
    fullName,
    role: invite.role,
    isVerified: true, // invite = verified
    status: "ACTIVE",
    mfa: {
      enabled: false,
      verified: false,
    },
  });

  await markInviteUsed(token);

  console.log("AUDIT_INVITE_ACCEPTED", {
    userId: user.id,
    role: invite.role,
  });

  return res.status(201).json({
    success: true,
    message: "Account created. Please login.",
  });
}


export async function resendInviteController(
  req: Request,
  res: Response
) {
  const { email } = req.body;

  const token = await createAdminInvite({
    email,
    role: "ADMIN",
    invitedBy: req.user!.id,
  });

  // send email again

  return res.json({ success: true });
}


export async function revokeInviteController(
  req: Request,
  res: Response
) {
  const { token } = req.body;
  await redisClient.del(adminInviteKey(token));
  return res.json({ success: true });
}

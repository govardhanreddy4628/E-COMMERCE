import { sendEmailUsingResend } from "./sendEmailUsingResend.js";

export const sendVerificationEmailUsingResend = async (
  to: string,
  otp: string
) => {
  return sendEmailUsingResend({
    to,
    subject: "Verify your Email",
    html: `
      <div style="font-family: Arial; padding: 12px;">
        <h2>Your OTP Code</h2>
        <p>Your email verification OTP is:</p>
        <h1 style="color: #4CAF50;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
};

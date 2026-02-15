import nodemailer from "nodemailer";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, //true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER!, //your SMTP email user
    pass: process.env.EMAIL_PASS!, // your SMTP email password
  },
  // tls: {
  //   rejectUnauthorized: false, // 👈 use this tls cerificate only for development mode. using it in production may cause security issues.
  // },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP CONNECTION ERROR:", error);
  } else {
    console.log("✅ SMTP CONNECTED SUCCESSFULLY");
  }
});


export const sendVerificationEmailUsingNodeMailer = async (to: string, verificationToken: string, text: string = "") => {
  console.log("📨 Attempting to send OTP to:", to);
 
  // const url = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  try {
    const info = await transporter.sendMail({
      from: `"classyShop" <${process.env.EMAIL_USER}>`, // sender address
      to,
      subject: "Verify Your Email",
      text,
      // html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    });
    console.log(`✅ Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error while sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};



//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; font-size: 16px;">
//       <p>Hello 👋,</p>
//       <p>Thanks for signing up at <strong>ClassyShop</strong>.</p>
//       <p>Please verify your email by clicking the button below:</p>
//       <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #1e87f0; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
//       <p>If you didn’t request this, just ignore this message.</p>
//       <br>
//       <p>— The ClassyShop Team</p>
//     </div>
//   `;



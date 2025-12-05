import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmailUsingResend = async (
  to: string,
  otp: string
) => {
  try {
    console.log("📨 Sending OTP using RESEND:", to);

    const { data, error } = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>", // or "no-reply@yourdomain.com"
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

    if (error) {
      console.error("❌ Resend error:", error);
      throw new Error("Resend failed to send email");
    }

    console.log("✅ Resend email sent:", data?.id);
  } catch (err) {
    console.error("❌ RESEND SEND ERROR:", err);
    throw err;
  }
};

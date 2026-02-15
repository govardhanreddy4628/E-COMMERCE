import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmailUsingResend = async ({
  to,
  subject,
  html,
}: SendEmailParams) => {
  try {
    console.log("📨 Sending email via Resend:", to);

    const { data, error } = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>", // change after domain verification
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      throw new Error("Failed to send email");
    }

    console.log("✅ Email sent:", data?.id);
    return data;
  } catch (err) {
    console.error("❌ SEND EMAIL ERROR:", err);
    throw err;
  }
};

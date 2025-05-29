import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (to: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    to,
    subject: 'Verify Your Email',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
};

import { Resend } from "resend";

export const sendPasswordResetEmail = async (
  recipientEmail: string,
  resetUrl: string
) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Job Tracker <onboarding@resend.dev>",
    to: recipientEmail,
    subject: "Reset your password",
    text: `Reset your password: ${resetUrl}`,
    html: `<a href="${resetUrl}">Reset your password</a>`
  });

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }

  return data;
};
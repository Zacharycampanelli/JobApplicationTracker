import { BrevoClient } from "@getbrevo/brevo";

export const sendPasswordResetEmail = async (
  recipientEmail: string,
  resetUrl: string
) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_FROM_ADDRESS;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  if (!senderEmail) {
    throw new Error("EMAIL_FROM_ADDRESS is not configured");
  }

  const brevo = new BrevoClient({ apiKey });

  return brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: process.env.EMAIL_FROM_NAME ?? "Job Tracker",
      email: senderEmail
    },
    to: [{ email: recipientEmail }],
    subject: "Reset your password",
    textContent: `Reset your password: ${resetUrl}`,
    htmlContent: `<a href="${resetUrl}">Reset your password</a>`
  });
};
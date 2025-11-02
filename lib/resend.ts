import { CreateEmailResponse, Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const supportEmail = process.env.SUPPORT_EMAIL || "";

export async function sendVerificationEmail(email: string, token: string) {
  if (!fromEmail) {
    console.error("EMAIL_FROM is not set in environment variables.");
    throw new Error("Email configuration error: From address is missing.");
  }
  if (!appUrl) {
    console.error("NEXT_PUBLIC_APP_URL is not set in environment variables.");
    throw new Error("Email configuration error: App URL is missing.");
  }

  const verificationLink = `${appUrl}/api/auth/verify-email?token=${token}`;

  try {
    const { data }: CreateEmailResponse = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Verify Your Email Address for Pokédex-2025 ",
      html: `
        <h1>Welcome to Pokédex-2025!</h1>
        <p>Thanks for signing up. Please verify your email address by clicking the button below:</p>
        <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p>${verificationLink}</p>
        <p>If you did not sign up for Pokédex-2025, please ignore this email.</p>
        <hr>
        <p>If you have any questions, please contact our support team at ${supportEmail}.</p>
      `,
    });
    console.log("Verification email sent successfully:", data?.id);
    return data;
  } catch (error) {
    console.error("Error sending verification email via Resend:", error);
    throw error; // Re-throw to be caught by the signup API
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  if (!fromEmail) {
    console.error("EMAIL_FROM is not set in environment variables.");
    throw new Error("Email configuration error: From address is missing.");
  }
  if (!appUrl) {
    console.error("NEXT_PUBLIC_APP_URL is not set in environment variables.");
    throw new Error("Email configuration error: App URL is missing.");
  }

  const resetLink = `${appUrl}/reset-password?token=${token}`;

  try {
    const { data }: CreateEmailResponse = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Reset Your Password - Pokédex-2025",
      html: `
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password for your Pokédex-2025 account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" style="background-color: #dc2626; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
        <p>${resetLink}</p>
        <p><strong>Important:</strong> If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
        <hr>
        <p>For security reasons, this link can only be used once. If you need to reset your password again, please request a new reset link.</p>
        <p>If you have any questions, please contact our support team at ${supportEmail}.</p>
      `,
    });
    console.log("Password reset email sent successfully:", data?.id);
    return data;
  } catch (error) {
    console.error("Error sending password reset email via Resend:", error);
    throw error;
  }
}

import { CreateEmailResponse, Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export async function sendVerificationEmail(email: string, token: string) {
  if (!fromEmail) {
    console.error("EMAIL_FROM is not set in environment variables.");
    throw new Error("Email configuration error: From address is missing.");
  }
  if (!appUrl) {
    console.error("NEXT_PUBLIC_APP_URL is not set in environment variables.");
    throw new Error("Email configuration error: App URL is missing.");
  }

  const verificationLink = `<span class="math-inline">${appUrl}/api/auth/verify-email?token=</span>${token}`; // Ensure this verify-email route is also an App Router route if it's not already

  try {
    const { data }: CreateEmailResponse = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Verify Your Email Address for Pokédex-2025 ",
      html: `
        <h1>Welcome to Pokédex-2025 !</h1>
        <p>Thanks for signing up. Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not sign up for Pokédex-2025 , please ignore this email.</p>
      `,
      // text: `Welcome to Pokédex-2025 ! ... ${verificationLink} ...`, // Optional plain text version
    });
    console.log("Verification email sent successfully:", data?.id);
    return data;
  } catch (error) {
    console.error("Error sending verification email via Resend:", error);
    throw error; // Re-throw to be caught by the signup API
  }
}

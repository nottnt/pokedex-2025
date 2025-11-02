import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { sendPasswordResetEmail } from "@/lib/resend";
import { forgotPasswordSchema } from "@/lib/validation/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    await connectToDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json(
        {
          message: "If an account with that email exists, you will receive a password reset link.",
        },
        { status: 200 }
      );
    }

    // Check if user has a password (not OAuth-only account)
    if (!user.passwordHash) {
      return NextResponse.json(
        {
          message: "This account uses social login. Please sign in with your social provider.",
        },
        { status: 400 }
      );
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Save reset token to user
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = resetTokenExpires;
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, resetToken);

      return NextResponse.json(
        {
          message: "If an account with that email exists, you will receive a password reset link.",
        },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);

      // Clear the reset token if email fails to send
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      await user.save();

      return NextResponse.json(
        {
          message: "There was an error sending the password reset email. Please try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { resetPasswordSchema } from "@/lib/validation/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = resetPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { token, password } = validationResult.data;

    await connectToDB();

    // Find user by reset token and check if token is not expired
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid or expired reset token. Please request a new password reset link.",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset token
    user.passwordHash = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();

    return NextResponse.json(
      {
        message: "Password reset successfully. You can now sign in with your new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET endpoint to validate reset token
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { message: "Reset token is required", valid: false },
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token", valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Valid reset token", valid: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", valid: false },
      { status: 500 }
    );
  }
}
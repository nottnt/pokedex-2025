import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { sendVerificationEmail } from "@/lib/resend"; // Using your Resend email function
import { requestVerificationEmailSchema } from "@/lib/validation/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = requestVerificationEmailSchema.safeParse(body);

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
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists for this email and it's not verified, a new verification email has been sent.",
        },
        { status: 200 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "This email address has already been verified." },
        { status: 400 }
      );
    }

    const newVerificationToken = crypto.randomBytes(32).toString("hex");
    const newVerificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    user.verificationToken = newVerificationToken;
    user.verificationTokenExpires = newVerificationTokenExpires;
    await user.save();

    try {
      await sendVerificationEmail(user.email, newVerificationToken);
    } catch (emailError) {
      console.error("Failed to resend verification email:", emailError);
      // Even if this fails, we don't want to reveal too much.
      // The user record is updated with a new token, they can try again later.
      return NextResponse.json(
        {
          message:
            "There was an issue sending the email. Please try again shortly.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "A new verification email has been sent. Please check your inbox.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

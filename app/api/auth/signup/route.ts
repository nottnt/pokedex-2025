import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signUpSchema, SignUpInput } from "@/lib/validation/auth";
import { sendVerificationEmail } from "@/lib/resend"; // Using the Resend email function

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = signUpSchema.safeParse(body);
    let emailSentSuccessfully = false;

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password }: SignUpInput = validationResult.data;

    await connectToDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 } // 409 Conflict
      );
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    const newUser = new User({
      email: email.toLowerCase(),
      passwordHash: passwordHash,
      verificationToken: verificationToken,
      verificationTokenExpires: verificationTokenExpires,
      emailVerified: null,
    });

    await newUser.save();

    try {
      await sendVerificationEmail(newUser.email, verificationToken);
      emailSentSuccessfully = true;
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    if (!emailSentSuccessfully) {
      return NextResponse.json(
        {
          message:
            "Account created, but we encountered an issue sending your verification email. Please try logging in and request a new verification email if needed.",
          userCreated: true,
          emailSent: false,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message:
          "User created successfully. Please check your email to verify your account.",
        userCreated: true,
        emailSent: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup API error:", error);
    if (error instanceof z.ZodError) {
      // Should be caught by safeParse, but as a fallback
      return NextResponse.json(
        { message: "Validation error", errors: error.flatten() },
        { status: 400 }
      );
    }
    // General server error
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/verification-failed?reason=missing_token", appUrl),
      { status: 302 }
    );
  }

  try {
    await connectToDB();
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/verification-failed?reason=invalid_or_expired_token", appUrl),
        { status: 302 }
      );
    }

    user.emailVerified = new Date();
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    // MODIFIED: Redirect to the root page with a query parameter
    return NextResponse.redirect(new URL("/?verified=true", appUrl), {
      status: 302,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/verification-failed?reason=server_error", appUrl),
      { status: 302 }
    );
  }
}

import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  await connectToDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  return NextResponse.json({ user });
}

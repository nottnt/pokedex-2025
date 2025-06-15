import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

import { TrainerFormData, trainerSchema } from "@/lib/validation/trainer";
import { authOptions } from "@/lib/authOptions";
import { ZodError } from "zod";
import Trainer from "@/lib/models/Trainer";
import User from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Trainer ID is required as a query parameter." },
        { status: 400 }
      );
    }

    await connectToDB();
    const trainer = await Trainer.findOne({
      _id: id,
    });

    if (!trainer) {
      return NextResponse.json(
        { message: `Trainer with ID "${id}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(trainer);
  } catch (err: any) {
    console.error("Error fetching trainer:", err);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDB();

    const userIdString = session.user.id;
    const userIdObject = new mongoose.Types.ObjectId(userIdString);

    // 5. Prevent duplicate profiles
    const existingTrainer = await Trainer.findOne({ userId: userIdObject });
    if (existingTrainer) {
      return NextResponse.json(
        { message: "Trainer profile already exists for this user." },
        { status: 409 } // 409 Conflict
      );
    }

    // 6. Get and validate the form data from the client
    const body: TrainerFormData = await req.json();
    const formData = trainerSchema.parse(body);

    // 7. Create the new trainer with the secure userId and client form data
    const newTrainer = new Trainer({
      ...formData,
      userId: userIdObject,
    });
    await newTrainer.save();

    // 8. CRITICAL: Update the User document to establish the link
    await User.findByIdAndUpdate(userIdObject, {
      $set: { trainer: newTrainer._id },
    });

    return NextResponse.json(newTrainer, { status: 201 }); // 201 Created
  } catch (err: any) {
    // 9. Better error handling
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid form data", errors: err.errors },
        { status: 400 }
      );
    }
    console.error("Error creating trainer:", err);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

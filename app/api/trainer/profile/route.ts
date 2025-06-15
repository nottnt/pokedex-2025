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

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication Check - No changes here
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

    const body: TrainerFormData = await req.json();
    const formData = trainerSchema.parse(body);

    const updatedOrCreatedTrainer = await Trainer.findOneAndUpdate(
      { userId: userIdObject },
      { $set: formData },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    await User.findByIdAndUpdate(userIdObject, {
      $set: { trainer: updatedOrCreatedTrainer._id },
    });

    return NextResponse.json(updatedOrCreatedTrainer, { status: 200 });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid form data", errors: err.errors },
        { status: 400 }
      );
    }
    console.error("Error creating/updating trainer:", err);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

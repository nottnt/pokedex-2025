import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Trainer from "@/lib/models/Trainer";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectToDB();

    const trainer = await Trainer.findById(id);

    if (!trainer) {
      return NextResponse.json(
        { message: `Trainer with ID "${id}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(trainer);
  } catch (err: any) {
    // This catches errors like an invalid MongoDB ObjectId format
    if (err.kind === "ObjectId") {
      return NextResponse.json(
        { message: `Invalid Trainer ID format: "${id}"` },
        { status: 400 }
      );
    }
    console.error("Error fetching trainer:", err);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

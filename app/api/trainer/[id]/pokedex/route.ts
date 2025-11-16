import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

import {
  TrainerPokemonData,
  trainerPokemonSchema,
} from "@/lib/validation/trainerPokemon";
import { authOptions } from "@/lib/authOptions";
import { ZodError } from "zod";
import TrainerPokemon from "@/lib/models/TrainerPokemon";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectToDB();
    const trainerPokemon = await TrainerPokemon.find({
      trainerId: id,
    });

    if (!trainerPokemon) {
      return NextResponse.json(
        { message: `Trainer Pokemon with ID "${id}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(trainerPokemon);
  } catch (err) {
    console.error("Error fetching trainer pokemon:", err);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDB();

    const trainerIdString = session?.user?.trainer?._id as string;
    const trainerIdObject = new mongoose.Types.ObjectId(trainerIdString);

    const body: TrainerPokemonData = await req.json();
    const formData = trainerPokemonSchema.parse(body);

    const createdTrainerPokemon = await TrainerPokemon.create({
      trainerId: trainerIdObject,
      pokemonId: formData.pokemonId,
      pokemonName: formData.pokemonName,
    });

    return NextResponse.json(createdTrainerPokemon, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid form data", errors: err.errors },
        { status: 400 }
      );
    }
    console.error("Error creating trainer pokemon:", err);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

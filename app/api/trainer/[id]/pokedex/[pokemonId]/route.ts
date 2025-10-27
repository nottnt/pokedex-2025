import { connectToDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import TrainerPokemon from "@/lib/models/TrainerPokemon";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pokemonId: string }> }
) {
  try {
    const { id: trainerId, pokemonId } = await params;

    await connectToDB();

    const deleteResult = await TrainerPokemon.deleteOne({
      pokemonId: pokemonId,
      trainerId: trainerId,
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        {
          message: `Pokemon with ID "${pokemonId}" for Trainer "${trainerId}" not found to delete.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Successfully deleted pokemon ${pokemonId} for trainer ${trainerId}.`,
    });
  } catch (err: any) {
    console.error("Error deleting specific trainer pokemon:", err);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

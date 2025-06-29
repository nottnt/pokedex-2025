import mongoose from "mongoose";
import { z } from "zod";

export const trainerPokemonSchema = z.object({
  pokemonId: z.string(),
  pokemonName: z.string(),
  trainerId: z
    .string()
    .refine((val) => {
      return mongoose.Types.ObjectId.isValid(val);
    })
    .optional(),
});

export type TrainerPokemonData = z.infer<typeof trainerPokemonSchema>;

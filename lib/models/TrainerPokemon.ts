import mongoose, {
  Schema,
  model,
  models,
  Document,
  Model,
} from "mongoose";
import { TrainerPokemonData } from "../validation/trainerPokemon";

export interface ITrainerPokemon extends Document, TrainerPokemonData {}

const TrainerPokemonSchema = new Schema<ITrainerPokemon>(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
    },
    pokemonId: { type: Number, required: true },
    pokemonName: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "trainer_pokemon",
  }
);

const TrainerPokemon: Model<ITrainerPokemon> =
  models.TrainerPokemon ||
  model<ITrainerPokemon>("TrainerPokemon", TrainerPokemonSchema);

export default TrainerPokemon;

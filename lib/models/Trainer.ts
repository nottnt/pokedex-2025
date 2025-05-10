import { Schema, model, models } from "mongoose";

const TrainerSchema = new Schema({
  name: String,
  age: Number,
  region: String,
  email: String,
  pokemonTeam: [String],
});

export const Trainer = models.Trainer || model("Trainer", TrainerSchema);

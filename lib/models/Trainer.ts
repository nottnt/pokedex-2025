import { Schema, model, models, Document, Model } from "mongoose";
import { TrainerFormData } from "../validation/trainer";

// 1. Define the interface for TypeScript
export interface ITrainer extends Document, TrainerFormData {}

// 2. Create the schema
const TrainerSchema = new Schema<ITrainer>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    region: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true, // optional: adds createdAt and updatedAt fields
    collection: "trainers",
  }
);

// 3. Create and export the model
export const Trainer: Model<ITrainer> =
  models.Trainer || model<ITrainer>("Trainer", TrainerSchema);

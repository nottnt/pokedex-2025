import mongoose, {
  Schema,
  model,
  models,
  Document,
  Model,
  Types,
} from "mongoose";
import { TrainerFormData } from "../validation/trainer";

// 1. Define the interface for TypeScript
export interface ITrainer extends Document, Omit<TrainerFormData, "userId"> {
  userId?: Types.ObjectId;
}

// 2. Create the schema
const TrainerSchema = new Schema<ITrainer>(
  {
    // Update userId to be a reference to the User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, required: true },
    age: { type: String, required: true },
    region: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "trainers",
  }
);

// 3. Create and export the model
const Trainer: Model<ITrainer> =
  models.Trainer || model<ITrainer>("Trainer", TrainerSchema);

export default Trainer;

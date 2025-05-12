import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
  },
  { timestamps: true, collection: "users" }
);

export default models.User || mongoose.model("User", userSchema);

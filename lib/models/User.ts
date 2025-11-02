// models/User.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash?: string; // Optional for OAuth users
  emailVerified: Date | null;
  verificationToken: string | null;
  verificationTokenExpires: Date | null;
  passwordResetToken: string | null;
  passwordResetTokenExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  // Add the reference to the Trainer model
  trainer: Types.ObjectId | null;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: false, // Not required for OAuth users
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetTokenExpires: {
      type: Date,
      default: null,
    },
    image: {
      type: String,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      default: null,
    },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

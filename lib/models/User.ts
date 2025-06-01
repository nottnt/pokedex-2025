// models/User.ts (or wherever your User model is defined)
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  // Fields added for email verification:
  emailVerified: Date | null; // Stores the timestamp when email was verified
  verificationToken: string | null; // Stores the unique token sent to the user's email
  verificationTokenExpires: Date | null; // Stores the expiration date of the verification token
  createdAt: Date;
  updatedAt: Date;
  image?: string; // Optional field for user profile image
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
      required: [true, "Password hash is required"],
    },
    // Definitions for the new fields:
    emailVerified: {
      type: Date,
      default: null, // Default to null, meaning not verified
    },
    verificationToken: {
      type: String,
      default: null, // No token by default
    },
    verificationTokenExpires: {
      type: Date,
      default: null, // No expiry by default
    },
    image: {
      type: String,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

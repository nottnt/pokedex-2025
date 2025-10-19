// src/lib/authOptions.ts

import GoogleProvider from "next-auth/providers/google";
import type { GoogleProfile } from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Trainer from "@/lib/models/Trainer";
import { AuthOptions } from "next-auth";
import { AuthProvider } from "@/types/common";


export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Optional: If you want to handle email verification for Google sign-in too,
      // you might need to check the `email_verified` property in the profile
      // and potentially link/update your User model accordingly in a `signIn` callback.
      // For now, focusing on CredentialsProvider.
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize: Attempting to authorize credentials user");
        try {
          // 1. Credentials check
          if (!credentials?.email || !credentials.password) {
            console.log("Authorize: Missing email or password");
            // throw new Error("Please provide both email and password."); // Or return null
            return null;
          }

          // 2. Database connection
          await connectToDB();

          // 3. User lookup
          const user = await User.findOne({
            email: credentials.email.toLowerCase(),
          }).populate("trainer");

          // 4. User existence and password field check
          if (!user) {
            console.log(
              "Authorize: User not found for email:",
              credentials.email
            );
            // throw new Error("Invalid credentials."); // Or return null
            return null;
          }
          if (!user.passwordHash) {
            console.log(
              "Authorize: User found, but no password stored (e.g., OAuth user)."
            );
            // throw new Error("This account does not use password login."); // Or return null
            return null;
          }

          // 5. Password comparison
          const isValidPassword = await compare(
            credentials.password,
            user.passwordHash
          );

          if (!isValidPassword) {
            console.log("Authorize: Invalid password for user:", user.email);
            // throw new Error("Invalid credentials."); // Or return null
            return null;
          }

          // 6. <<<--- EMAIL VERIFICATION CHECK ---<<<
          if (!user.emailVerified) {
            console.log("Authorize: Email not verified for user:", user.email);
            // Throwing a specific error message is good for client-side handling
            throw new Error(
              "Email not verified. Please check your inbox or request a new verification email."
            );
          }
          // If you prefer a shorter error code to check on client:
          // throw new Error("EMAIL_NOT_VERIFIED");

          console.log(
            "Authorize: Credentials valid and email verified for user:",
            user.email
          );
          // 7. Successful authorization
          return {
            id: (user._id as string).toString(),
            email: user.email,
            // name: user.name, // If you have a name field
            image: user.image, // If you have an image field
            // Add any other user properties you want in the token/session
            trainer: user.trainer,
          };
        } catch (error: any) {
          // Log the error that occurred in the try block OR the error thrown by us (e.g., Email not verified)
          console.error(`Authorize error: ${error.message}`);
          // Re-throw the error so NextAuth can handle it (or it bubbles up to signIn call)
          throw error; // Or throw new Error(error.message) if you want to ensure it's an Error instance
        }
      },
    }),
  ],
  pages: {
    // For App Router, signIn page is typically handled by your root page or a specific route
    // If you want to redirect to a custom page on error, you can use query params.
    // Example: signIn: '/auth/signin', // or just '/' if your dialog is there
    // error: '/auth/error' // A page to handle general auth errors
    signIn: "/", // Since your login is a dialog on the root page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // This callback is called on successful signin AFTER authorize.
      // For Google OAuth, create user if they don't exist
      if (account?.provider === AuthProvider.GOOGLE && profile) {
        try {
          await connectToDB();

          const googleProfile = profile as GoogleProfile;

          // Check if user already exists
          let existingUser = await User.findOne({
            email: googleProfile.email?.toLowerCase()
          });

          // If user doesn't exist, create them
          if (!existingUser) {
            existingUser = await User.create({
              email: googleProfile.email?.toLowerCase(),
              name: googleProfile.name,
              image: googleProfile.picture,
              emailVerified: googleProfile.email_verified ? new Date() : null,
              // Don't set passwordHash for OAuth users
            });

            const trainer = await Trainer.findOne({
              userId: existingUser._id,
            });

            if (!trainer) {
              const newTrainer = new Trainer({
                userId: existingUser._id,
                name: googleProfile.name,
                createdAt: new Date(),
              });
              await newTrainer.save();
            }
            console.log("Created new Google user:", existingUser.email);
          } else {
            // Update existing user with Google info if needed
            if (!existingUser.image && googleProfile.picture) {
              existingUser.image = googleProfile.picture;
            }
            if (!existingUser.emailVerified && googleProfile.email_verified) {
              existingUser.emailVerified = new Date();
            }
            await existingUser.save();
            console.log("Updated existing user with Google info:", existingUser.email);
          }

          // Update the user object that will be passed to JWT callback
          user.id = (existingUser._id as string).toString();
          user.trainer = existingUser.trainer;

        } catch (error) {
          console.error("Error handling Google sign-in:", error);
          return false; // Prevent sign-in on error
        }
      }
      return true; // Allow sign in
    },
    async jwt({ token, user }) {
      // `user` is available on initial sign-in
      if (user) {
        token.id = user.id; // id comes from what `authorize` or OAuth profile returns
        token.trainer = user.trainer;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.trainer = token.trainer;
      }
      // if (token.emailVerified !== undefined && session.user) {
      //   (session.user as any).emailVerified = token.emailVerified; // Requires extending Session type
      // }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Optional: debug: process.env.NODE_ENV === 'development', // For more logs from NextAuth
};

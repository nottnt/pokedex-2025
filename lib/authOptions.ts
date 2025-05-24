// src/lib/authOptions.ts  (or your chosen path)

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectToDB } from "@/lib/mongodb"; // Assuming this path is correct relative to your project root
import User from "@/lib/models/User"; // Assuming this path is correct
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // 1. Credentials check
          if (!credentials?.email || !credentials.password) {
            console.log("Authorize: Missing email or password");
            return null;
          }

          // 2. Database connection
          console.log("Authorize: Attempting to connect to DB");
          await connectToDB();
          console.log("Authorize: Connected to DB");

          // 3. User lookup
          console.log(`Authorize: Looking up user: ${credentials.email}`);
          const user = await User.findOne({ email: credentials.email });

          // 4. User existence and password field check
          if (!user) {
            console.log("Authorize: User not found");
            return null;
          }
          if (!user.password) {
            console.log(
              "Authorize: User found, but no password stored for this user."
            );
            return null;
          }
          console.log("Authorize: User found, password field exists.");

          // 5. Password comparison
          console.log("Authorize: Comparing passwords");
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            console.log(
              "Authorize: Password comparison failed (invalid password)"
            );
            return null;
          }

          console.log("Authorize: Password valid, returning user object");
          // 6. Successful authorization
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error: any) {
          console.error(
            `Authorize error in catch block: ${error.message}`,
            error
          ); // Enhanced error logging
          return null; // Explicitly return null on any caught error
        }
      },
    }),
  ],
  pages: {
    signIn: "/", // We'll discuss this for App Router below
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    // OPTIONAL: If you want to add more to the JWT token itself (e.g., name, email, custom roles)
    // which then gets passed to the session callback, you might also need a jwt callback:
    /*
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // user.id comes from the 'id' you returned in 'authorize'
        // token.name = user.name; // if you want name directly in token
        // token.email = user.email; // if you want email directly in token
      }
      return token;
    },
    */
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

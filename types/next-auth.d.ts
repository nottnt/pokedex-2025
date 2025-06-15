import { ITrainer } from "@/lib/models/Trainer";
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Extend the built-in session and user types
declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends DefaultUser {
    // Add the trainer property to the User object
    trainer: ObjectId | null;
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      // Add the trainer property to the session's user object
      trainer: ITrainer | null;
    } & DefaultSession["user"];
  }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    // Add the trainer property to the token
    trainer: ITrainer | null;
  }
}

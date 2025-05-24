// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust this path if you saved authOptions.ts elsewhere

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

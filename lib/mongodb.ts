// lib/mongodb.ts
import mongoose from "mongoose";

export async function connectToDB() {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(process.env.MONGODB_URI!, {
    dbName: "pokedex",
  });
}

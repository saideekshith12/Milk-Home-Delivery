import mongoose from "mongoose";

const url = process.env.MONGO_URL;
if (!url) {
  throw new Error("Database URL not found. Check your .env file.");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function Databaseconnection() {
  if (cached.conn) return cached.conn;

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(url).then((mongoose) => {
        console.log("Database connected");
        return mongoose;
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export default Databaseconnection;


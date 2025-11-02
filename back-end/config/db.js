// db.js
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://24ceuos030_db_user:RN78hYSRUvwPVDlE@e-commerce.oabfxlc.mongodb.net/test?retryWrites=true&w=majority&appName=e-commerce";

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined in environment variables.");
}

// Global cache to prevent multiple connections in serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds
    };

    cached.promise = mongoose.connect(MONGO_URI, opts)
      .then((mongooseInstance) => {
        console.log("✅ Connected to MongoDB");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

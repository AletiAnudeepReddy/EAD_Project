// server/utils/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment");
}

let cached = global._mongo;

if (!cached) {
    cached = global._mongo = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI)
            .then((m) => {
                console.log("✅ MongoDB connected");
                return m;
            })
            .catch((err) => {
                console.error("❌ MongoDB connection error:", err);
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
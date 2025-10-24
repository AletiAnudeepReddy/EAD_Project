// server/utils/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment");
}

let cached = global._mongo; // preserve across hot reloads
if (!cached) cached = global._mongo = { conn: null, promise: null };

export async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((m) => m);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

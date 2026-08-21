import mongoose from "mongoose";
import dns from "dns";


dns.setDefaultResultOrder("ipv4first");


interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
    const MONGODB_URI = process.env.MONGODB_URI!;

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        console.log("🛠️  Connecting to MongoDB...");
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            socketTimeoutMS: 30000,
            maxPoolSize: 10,
            family: 4, // Force IPv4 — fixes SRV DNS resolution failures on Vercel
        }).then((m) => {
            console.log("✅ MongoDB Connected Successfully");
            return m;
        }).catch((err) => {
            console.error("❌ MongoDB Connection Error:", err.message);
            // Reset cache on failure so next call retries
            cached.promise = null;
            cached.conn = null;
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}

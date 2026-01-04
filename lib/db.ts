import mongoose from 'mongoose';

/**
 * We store the connection globally to prevent
 * multiple connections during hot reload in dev mode
 */

const MONGODBURI = process.env.MONGODB_URI!;

if (!MONGODBURI) { throw new Error("Please Define MONGODB_URI in .env file"); }

declare global { var mongoose: any };

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODBURI).then((mongoose) => {
            return mongoose;
        })
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
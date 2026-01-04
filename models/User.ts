import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

export const User = models.User || mongoose.model("User", userSchema);
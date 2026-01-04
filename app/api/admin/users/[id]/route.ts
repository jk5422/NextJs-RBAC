export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAuthFromRequest } from "@/lib/authMiddleware";
import { z } from "zod";
import mongoose from "mongoose";

const updateUserSchema = z.object({
    name: z.string().min(2),
    role: z.enum(["admin", "user"]),
});

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // ✅ unwrap params FIRST
        const { id } = await context.params;

        const auth = requireAuthFromRequest(req);
        if (auth.role !== "admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const parsed = updateUserSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: "Invalid data" },
                { status: 400 }
            );
        }

        await connectDB();

        const updated = await User.findByIdAndUpdate(
            new mongoose.Types.ObjectId(id),
            { $set: parsed.data },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        console.log("✅ Updated user:", updated._id);

        return NextResponse.json({ message: "User updated" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}


export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // ✅ unwrap params FIRST
        const { id } = await context.params;

        const auth = requireAuthFromRequest(req);
        if (auth.role !== "admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await connectDB();

        const deleted = await User.findByIdAndDelete(
            new mongoose.Types.ObjectId(id)
        );

        if (!deleted) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        console.log("🗑️ Deleted user:", deleted._id);

        return NextResponse.json({ message: "User deleted" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}

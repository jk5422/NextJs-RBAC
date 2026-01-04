import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAdminFromRequest } from "@/lib/authMiddleware";
import { z } from "zod";
import { hashPassword } from "@/lib/password";

const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["admin", "user"]) // admin can create admins
});

const updateUserSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(["admin", "user"]).optional()
});

export async function GET(req: Request) {
    try {
        // Server-side require admin
        requireAdminFromRequest(req);

        await connectDB();

        const url = new URL(req.url);
        const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);
        const limit = Math.min(Number(url.searchParams.get("limit")) || 10, 100);

        const skip = (page - 1) * limit;

        const [total, users] = await Promise.all([
            User.countDocuments(),
            User.find({}, "_id name email role createdAt").sort({ createdAt: -1 }).skip(skip).limit(limit)
        ]);

        return NextResponse.json({ users, total, page, limit });
    } catch (err: any) {
        console.error("Admin users GET error:", err);
        const status = err?.status || 401;
        return NextResponse.json({ message: err?.message || "Unauthorized" }, { status });
    }
}

export async function POST(req: Request) {
    try {
        // Server-side require admin
        requireAdminFromRequest(req);

        const body = await req.json();
        const parsed = createUserSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ message: "Invalid input", errors: parsed.error.flatten() }, { status: 400 });
        }

        const { name, email, password, role } = parsed.data;

        await connectDB();

        const exists = await User.findOne({ $or: [{ email }, { name }] });
        if (exists) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        const hashed = await hashPassword(password);
        const user = await User.create({ name, email, password: hashed, role });

        return NextResponse.json({ message: "User created", user: { id: user._id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
    } catch (err: any) {
        console.error("Admin users POST error:", err);
        const status = err?.status || 401;
        return NextResponse.json({ message: err?.message || "Unauthorized" }, { status });
    }
}

export async function PATCH(req: Request) {
    try {
        requireAdminFromRequest(req);

        const body = await req.json();
        const parsed = updateUserSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ message: "Invalid input", errors: parsed.error.flatten() }, { status: 400 });
        }

        const { id, name, email, password, role } = parsed.data;

        await connectDB();

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (password) updateData.password = await hashPassword(password);

        const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select("_id name email role createdAt");

        if (!updated) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ message: "User updated", user: updated });
    } catch (err: any) {
        console.error("Admin users PATCH error:", err);
        const status = err?.status || 401;
        return NextResponse.json({ message: err?.message || "Unauthorized" }, { status });
    }
}

export async function DELETE(req: Request) {
    try {
        requireAdminFromRequest(req);

        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "Missing id parameter" }, { status: 400 });
        }

        await connectDB();

        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ message: "User deleted" });
    } catch (err: any) {
        console.error("Admin users DELETE error:", err);
        const status = err?.status || 401;
        return NextResponse.json({ message: err?.message || "Unauthorized" }, { status });
    }
}
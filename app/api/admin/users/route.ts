import { requireAuthFromRequest } from "@/lib/authMiddleware";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";
import { z } from "zod";

const createUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["admin", "user"]),
});

export async function GET(req: Request) {
    try {
        const auth = requireAuthFromRequest(req);
        if (auth.role !== "admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get('limit') || 10);
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().select("_id name email role").skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments(),
        ])

        return NextResponse.json({
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        })
    }
    catch (err) {
        return NextResponse.json({ message: "Unauthorized", errors: err }, { status: 401 });
    }
}



export async function POST(req: Request) {
    try {
        const auth = requireAuthFromRequest(req);
        if (auth.role !== "admin") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const parsed = createUserSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { message: "Invalid data" },
                { status: 400 }
            );
        }

        await connectDB();

        const exists = await User.findOne({ email: parsed.data.email });
        if (exists) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        await User.create({
            ...parsed.data,
            password: await hashPassword(parsed.data.password),
        });

        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}

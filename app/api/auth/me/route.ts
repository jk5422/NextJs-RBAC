import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAuthFromRequest } from "@/lib/authMiddleware";

export async function GET(req: Request) {
    try {
        const authUser = requireAuthFromRequest(req);

        await connectDB();

        const user = await User.findById(authUser.userId).select(
            "_id name email role createdAt"
        );

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAuthFromRequest } from "@/lib/authMiddleware";
import { NotFoundError, UnauthorizedError } from "@/lib/apiError";

export async function GET(req: Request) {
    try {
        const authUser = requireAuthFromRequest(req);

        await connectDB();

        const user = await User.findById(authUser.userId).select(
            "_id name email role createdAt"
        );

        if (!user) {
            return NotFoundError('User not found')
        }

        return NextResponse.json({ user });
    } catch {
        return UnauthorizedError();
    }
}

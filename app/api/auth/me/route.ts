import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { requireAuthFromRequest } from "@/lib/authMiddleware";

export async function GET(req: Request) {
    try {
        const authUser = requireAuthFromRequest(req);

        if (process.env.NODE_ENV !== 'production') {
            console.log('MeRoute debug: authUser from token =', authUser);
            console.log('MeRoute debug: Cookie header =', req.headers.get('cookie'));
        }

        await connectDB();

        const user = await User.findById(authUser.userId).select(
            "_id name email role createdAt"
        );

        if (!user) {
            if (process.env.NODE_ENV !== 'production') console.log('MeRoute debug: DB user not found for id', authUser.userId);
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (process.env.NODE_ENV !== 'production') console.log('MeRoute debug: returning user', { id: user._id.toString(), role: user.role });

        return NextResponse.json({ user });
    } catch (err: any) {
        if (process.env.NODE_ENV !== 'production') console.log('MeRoute debug: error', err?.message || err);
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}

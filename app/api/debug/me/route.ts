import { NextResponse } from "next/server";
import { requireAuthFromRequest } from "@/lib/authMiddleware";

export async function GET(req: Request) {
    // Only allow in non-production to avoid exposing info in prod
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    try {
        const data = requireAuthFromRequest(req);
        // Return only non-sensitive fields
        return NextResponse.json({ payload: data });
    } catch (err: any) {
        return NextResponse.json({ message: err?.message || "Unauthorized" }, { status: 401 });
    }
}
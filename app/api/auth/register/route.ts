export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { registerController } from "@/controllers/authController";
import { handleApiError } from "@/lib/apiError";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await registerController(body);

        return NextResponse.json(
            { message: "User registered" },
            { status: 201 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}

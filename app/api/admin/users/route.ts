import { NextResponse } from "next/server";
import { requireAuthFromRequest } from "@/lib/authMiddleware";
import { handleApiError } from "@/lib/apiError";
import { fetchUsersController } from "@/controllers/adminUserController";

export async function GET(req: Request) {
    try {
        const auth = requireAuthFromRequest(req);

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 10);

        const { users, total } = await fetchUsersController(
            auth.role,
            page,
            limit
        );


        return NextResponse.json({
            data: users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}

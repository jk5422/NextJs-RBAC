import { NextResponse } from "next/server";
import { requireAuthFromRequest } from "@/lib/authMiddleware";
import { handleApiError } from "@/lib/apiError";
import {
    updateUserController,
    deleteUserController,
} from "@/controllers/adminUserController";

export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const auth = requireAuthFromRequest(req);
        const body = await req.json();

        await updateUserController(auth.role, id, body);

        return NextResponse.json({ message: "User updated" });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const auth = requireAuthFromRequest(req);

        await deleteUserController(auth, id);

        return NextResponse.json({ message: "User deleted" });
    } catch (error) {
        return handleApiError(error);
    }
}

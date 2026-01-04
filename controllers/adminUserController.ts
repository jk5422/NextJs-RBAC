import { z } from "zod";
import { connectDB } from "@/lib/db";
import {
    ForbiddenError,
    NotFoundError,
    BadRequestError,
} from "@/lib/apiError";
import {
    getPaginatedUsers,
    updateUserById,
    deleteUserById,
} from "@/services/userService";
import { AdminUser } from "@/types/admin-user";

const updateUserSchema = z.object({
    name: z.string().min(2),
    role: z.enum(["admin", "user"]),
});

export async function fetchUsersController(
    role: string,
    page: number,
    limit: number
): Promise<{
    users: AdminUser[];
    total: number;
}> {
    if (role !== "admin") {
        throw ForbiddenError();
    }

    await connectDB();
    return getPaginatedUsers(page, limit);
}

export async function updateUserController(
    role: string,
    userId: string,
    body: unknown
) {
    if (role !== "admin") {
        throw ForbiddenError();
    }

    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
        throw BadRequestError("Invalid user data");
    }

    await connectDB();
    const updated = await updateUserById(userId, parsed.data);

    if (!updated) {
        throw NotFoundError("User not found");
    }

    return updated;
}

export async function deleteUserController(
    auth: object,
    userId: string
) {
    if (auth?.role !== "admin") {
        throw ForbiddenError();
    }

    await connectDB();
    if (auth?.userId !== userId) {
        const deleted = await deleteUserById(userId);

        if (!deleted) {
            throw NotFoundError("User not found");
        }

        return deleted;
    }
    else {
        return BadRequestError("User Can't Delete Self Account")
    }
}

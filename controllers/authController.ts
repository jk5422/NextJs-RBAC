import {
    BadRequestError,
    UnauthorizedError,
} from "@/lib/apiError";
import { connectDB } from "@/lib/db";
import { loginSchema, registerSchema } from "@/schemas/auth.schema";
import {
    getUserById,
    loginUser,
    registerUser,
} from "@/services/authService";


export async function registerController(body: unknown) {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
        throw BadRequestError("Invalid registration data");
    }

    await connectDB();
    const user = await registerUser(parsed.data);

    if (!user) {
        throw BadRequestError("User already exists");
    }

    return user;
}

export async function loginController(body: unknown) {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
        throw BadRequestError("Invalid login data");
    }

    await connectDB();
    const result = await loginUser(
        parsed.data.email,
        parsed.data.password
    );

    if (!result) {
        throw UnauthorizedError();
    }

    return result; // { user, token }
}

export async function meController(userId: string) {
    await connectDB();
    const user = await getUserById(userId);

    if (!user) {
        throw UnauthorizedError();
    }

    return user;
}

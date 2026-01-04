import { UnauthorizedError } from "./apiError";
import { verifyToken } from "./jwt";

export function requireAuthFromRequest(req: Request) {
    const cookieHeader = req?.headers?.get("cookie") || '';

    if (!cookieHeader) {
        throw UnauthorizedError();
    }

    const token = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        throw UnauthorizedError();

    }

    return verifyToken(token) as {
        userId: string;
        role: string;
    };
}

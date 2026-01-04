import { verifyToken } from "./jwt";

export function requireAuthFromRequest(req: Request) {
    const cookieHeader = req?.headers?.get("cookie") || '';

    if (!cookieHeader) {
        throw new Error("Unauthorized");
    }

    const token = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        throw new Error("Unauthorized");
    }

    return verifyToken(token) as {
        userId: string;
        role: string;
    };
}

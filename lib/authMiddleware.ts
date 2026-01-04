import { verifyToken } from "./jwt";
import { decodeToken } from "./decodeToken";

export type AuthPayload = {
    userId: string;
    role: string;
};

export function requireAuthFromRequest(req: Request): AuthPayload {
    const cookieHeader = req?.headers?.get("cookie") || '';

    if (!cookieHeader) {
        const msg = "Unauthorized: missing cookie header";
        if (process.env.NODE_ENV !== 'production') console.log("AuthDebug:", msg);
        throw new Error(msg);
    }

    const token = cookieHeader
        .split("; ")
        .find((c) => c.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        const msg = "Unauthorized: token cookie not set";
        if (process.env.NODE_ENV !== 'production') console.log("AuthDebug:", msg, cookieHeader);
        throw new Error(msg);
    }

    try {
        return verifyToken(token) as AuthPayload;
    } catch (err: any) {
        const msg = "Unauthorized: invalid token" + (process.env.NODE_ENV !== 'production' ? `: ${err?.message}` : '');
        if (process.env.NODE_ENV !== 'production') {
            // For debugging, show decoded payload if possible (without verifying signature)
            const decoded = decodeToken(token);
            console.log("AuthDebug: token verification failed. decode payload:", decoded);
            console.log("AuthDebug: verify error:", err?.message || err);
        }
        throw new Error(msg);
    }
}

export function requireAdminFromRequest(req: Request): AuthPayload {
    const auth = requireAuthFromRequest(req);

    if (auth.role !== "admin") {
        const err: any = new Error("Forbidden: admin role required");
        err.status = 403;
        throw err;
    }

    return auth;
}

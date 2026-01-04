import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "./lib/decodeToken";

export function middleware(request: NextRequest) {
    // Middleware only for navigation
    if (request.method !== "GET") {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    const isAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/register");

    const isProfileRoute = pathname.startsWith("/profile");
    const isAdminRoute = pathname.startsWith("/admin");

    // ❌ Not logged in → protected routes
    if (!token && (isProfileRoute || isAdminRoute)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // ❌ Logged in → auth pages
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    // 🔐 STRICT ADMIN CHECK
    if (token && isAdminRoute) {
        const decoded = decodeToken(token);

        // ❌ Not admin OR cannot decode
        if (!decoded || decoded.role !== "admin") {
            return NextResponse.redirect(new URL("/profile", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/admin/:path*",
        "/login",
        "/register",
    ],
};

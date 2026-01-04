import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "./lib/decodeToken";

export function middleware(request: NextRequest) {
    // Middleware only for navigation
    if (request.method !== "GET") {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    if (process.env.NODE_ENV !== 'production') {
        console.log('Middleware debug: pathname=', pathname, 'hasToken=', Boolean(token));
    }

    const isAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/register");

    const isProfileRoute = pathname.startsWith("/profile");
    const isAdminRoute = pathname.startsWith("/admin");

    // ❌ Not logged in → protected routes
    if (!token && (isProfileRoute || isAdminRoute)) {
        if (process.env.NODE_ENV !== 'production') console.log('Middleware debug: redirect to /login (no token)');
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // ❌ Logged in → auth pages
    if (token && isAuthPage) {
        if (process.env.NODE_ENV !== 'production') console.log('Middleware debug: redirect to /profile (isAuthPage, logged in)');
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    // NOTE: Middleware runs at the Edge/browser navigation layer and should NOT make
    // security-critical auth decisions based on unverified token payloads (e.g. decoding
    // the JWT payload without verifying its signature). Doing so can be spoofed by an
    // attacker. Use *server-side* checks (for example, `app/(dashboard)/admin/layout.tsx`)
    // or protected API endpoints that call `verifyToken` to make authoritative RBAC decisions.
    // Here we keep middleware responsibility narrow (presence-only checks and redirects)
    // and defer strict RBAC to server-side layouts and APIs for defense-in-depth.

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

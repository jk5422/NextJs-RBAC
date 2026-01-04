import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import { ReactNode } from "react";

function getTokenFromServerCookies(): string | undefined {
    // Try the `cookies()` helper first (modern Next APIs)
    try {
        const c = cookies();
        if (c && typeof (c as any).get === "function") {
            return (c as any).get("token")?.value;
        }
    } catch (e) {
        // ignore and fallback to headers parsing
    }

    // Fallback: parse Cookie header manually
    try {
        const cookieHeader = headers().get("cookie") || "";
        const match = cookieHeader.split("; ").find((c) => c.startsWith("token="));
        if (!match) return undefined;
        return match.split("=")[1];
    } catch (e) {
        return undefined;
    }
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const token = getTokenFromServerCookies();

    // Not logged in → send to login
    if (!token) {
        if (process.env.NODE_ENV !== "production") {
            console.log("AdminLayout debug: no token present (unauthenticated)");
        }
        redirect("/login");
    }

    try {
        const decoded = verifyToken(token!) as { role?: string };

        if (process.env.NODE_ENV !== "production") {
            console.log("AdminLayout debug: verified token role=", decoded?.role);
        }

        // Not admin → redirect to profile
        if (decoded?.role !== "admin") {
            if (process.env.NODE_ENV !== "production") {
                console.log("AdminLayout debug: user is not admin, redirecting to /profile");
            }
            redirect("/profile");
        }
    } catch (err: any) {
        if (process.env.NODE_ENV !== "production") {
            console.log("AdminLayout debug: token verify error:", err?.message || err);
        }
        // Invalid token → redirect to login
        redirect("/login");
    }

    return <>{children}</>;
}

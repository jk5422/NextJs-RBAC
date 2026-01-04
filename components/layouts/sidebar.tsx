"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/hooks/useAuthUser";

export function Sidebar() {
    const pathname = usePathname();
    const { data: user, isLoading } = useAuthUser();
    console.log(user, "asdadsadasdsa")
    if (isLoading) {
        return (
            <aside className="w-64 border-r bg-white p-4">
                <p className="text-sm text-muted-foreground">Loading menu...</p>
            </aside>
        );
    }


    return (
        <aside className="w-64 border-r bg-white p-4">
            <h2 className="mb-6 text-lg font-semibold">RBAC App</h2>

            <nav className="space-y-2">
                <Link
                    href="/profile"
                    className={cn(
                        "block rounded px-3 py-2 text-sm hover:bg-slate-100",
                        pathname === "/profile" && "bg-slate-100 font-medium"
                    )}
                >
                    Profile
                </Link>

                {/* 🔐 Admin-only link */}
                {user?.role === "admin" && (
                    <Link
                        href="/admin"
                        className={cn(
                            "block rounded px-3 py-2 text-sm hover:bg-slate-100",
                            pathname === "/admin" && "bg-slate-100 font-medium"
                        )}
                    >
                        Admin
                    </Link>
                )}
            </nav>
        </aside>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ThemeToggle } from "../theme-toggle";

export function Header() {
    const router = useRouter();

    const logout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        toast.success("Logged out");
        router.push("/login");
    };

    return (
        <header className="flex h-14 items-center justify-between border-b bg-white px-6">
            <span className="text-sm text-slate-600">
                Dashboard
            </span>

            <ThemeToggle />

            <Button variant="outline" size="sm" onClick={logout}>
                Logout
            </Button>
        </header>
    );
}

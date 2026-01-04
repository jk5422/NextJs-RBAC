import { useQuery } from "@tanstack/react-query";
import { AuthUser } from "@/types/user";

interface MeResponse {
    user: AuthUser;
}

export function useAuthUser() {
    return useQuery<AuthUser>({
        queryKey: ["auth-user"],
        queryFn: async () => {
            const res = await fetch("/api/auth/me", {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Unauthorized");
            }

            const data: MeResponse = await res.json();
            return data.user; // ✅ now matches type
        },
        retry: false,
    });
}

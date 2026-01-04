import { useQuery } from "@tanstack/react-query";
import { AdminUser } from "@/types/admin-user";
import { PaginatedResponse } from "@/types/pagination";
import { UnauthorizedError } from "@/lib/apiError";

export function useAdminUsers(page: number) {
    return useQuery<PaginatedResponse<AdminUser>>({
        queryKey: ["admin-users", page],
        queryFn: async () => {
            const res = await fetch(
                `/api/admin/users?page=${page}&limit=10`,
                { credentials: "include" }
            );

            if (!res.ok) {
                const error = await res.json();
                throw UnauthorizedError(error.message || "Unauthorized");
            }

            return res.json();
        },
        keepPreviousData: true,
    });
}

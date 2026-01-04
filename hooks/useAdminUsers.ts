import { useQuery } from "@tanstack/react-query";

export function useAdminUsers(page: number) {
    return useQuery({
        queryKey: ["admin-users", page],
        queryFn: async () => {
            const res = await fetch(
                `/api/admin/users?page=${page}&limit=10`,
                { credentials: "include" }
            );

            if (!res.ok) {
                throw new Error("Unauthorized");
            }

            return res.json();
        },
        keepPreviousData: true,
    });
}

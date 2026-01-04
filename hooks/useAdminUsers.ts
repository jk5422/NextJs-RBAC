import { useQuery } from "@tanstack/react-query";

type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
};

type Response = {
    users: User[];
    total: number;
    page: number;
    limit: number;
};

export function useAdminUsers(page = 1, limit = 10) {
    return useQuery<Response, Error>(["admin-users", page, limit], async () => {
        const res = await fetch(`/api/admin/users?page=${page}&limit=${limit}`, {
            credentials: "include",
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data?.message || res.statusText || "Error fetching users");
        }

        return res.json();
    });
}

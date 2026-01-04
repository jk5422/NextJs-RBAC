import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateUserPayload = {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
};

export function useCreateUser() {
    const qc = useQueryClient();

    return useMutation(
        async (payload: CreateUserPayload) => {
            const res = await fetch(`/api/admin/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message || res.statusText || "Create failed");
            }

            return res.json();
        },
        {
            onSuccess: () => {
                qc.invalidateQueries(["admin-users"]);
            },
        }
    );
}

export function useUpdateUser() {
    const qc = useQueryClient();

    return useMutation(
        async (payload: any) => {
            const res = await fetch(`/api/admin/users`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message || res.statusText || "Update failed");
            }

            return res.json();
        },
        {
            onSuccess: () => qc.invalidateQueries(["admin-users"]),
        }
    );
}

export function useDeleteUser() {
    const qc = useQueryClient();

    return useMutation(
        async (id: string) => {
            const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message || res.statusText || "Delete failed");
            }

            return res.json();
        },
        {
            onSuccess: () => qc.invalidateQueries(["admin-users"]),
        }
    );
}

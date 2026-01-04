"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { PaginatedResponse } from "@/types/pagination";
import { AdminUser } from "@/types/admin-user";

export default function DeleteUserDialog({
    userId,
}: {
    userId: string;
}) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Delete failed");
            }

            return true;
        },

        // 🔥 OPTIMISTIC UPDATE START
        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: ["admin-users"],
            });

            const previousData =
                queryClient.getQueriesData<PaginatedResponse<AdminUser>>({
                    queryKey: ["admin-users"],
                });

            // Remove user optimistically
            queryClient.setQueriesData<PaginatedResponse<AdminUser>>(
                { queryKey: ["admin-users"] },
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        data: old.data.filter(
                            (user) => user._id !== userId
                        ),
                        pagination: {
                            ...old.pagination,
                            total: old.pagination.total - 1,
                        },
                    };
                }
            );

            return { previousData };
        },

        onError: (_error, _variables, context) => {
            // 🔄 ROLLBACK
            context?.previousData.forEach(([key, data]) => {
                queryClient.setQueryData(key, data);
            });

            toast.error("Failed to delete user");
        },

        onSuccess: () => {
            toast.success("User deleted");
            setOpen(false);
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            });
        },
        // 🔥 OPTIMISTIC UPDATE END
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="destructive">
                    Delete
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this user?
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                    >
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

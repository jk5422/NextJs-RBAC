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

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            return result;
        },
        onSuccess: () => {
            toast.success("User deleted");
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            setOpen(false);
        },
        onError: (e: any) => toast.error(e.message),
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
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                </p>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
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

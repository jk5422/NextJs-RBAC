"use client";

import { useState } from "react";
import { AdminUser } from "@/types/admin-user";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const editSchema = z.object({
    name: z.string().min(2),
    role: z.enum(["admin", "user"]),
});

type EditForm = z.infer<typeof editSchema>;

export default function EditUserDialog({ user }: { user: AdminUser }) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<EditForm>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            name: user.name,
            role: user.role,
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: EditForm) => {
            const res = await fetch(`/api/admin/users/${user._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message);

            return result;
        },
        onSuccess: () => {
            toast.success("User updated");
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            setOpen(false);
        },
        onError: (e: object) => toast.error(e.message),
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) =>
                            mutation.mutate(data)
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="w-full rounded border px-3 py-2"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={mutation.isPending}
                        >
                            Save
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

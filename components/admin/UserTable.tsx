"use client";

import React, { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/useAdminUserMutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

export default function UserTable() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const { data, isLoading, isError } = useAdminUsers(page, limit);
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();

    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    if (isLoading) return <p className="text-sm text-muted-foreground">Loading users...</p>;
    if (isError) return <p className="text-sm text-destructive">Unable to load users</p>;

    const users = data?.users || [];

    async function onCreate(values: any) {
        try {
            await createUser.mutateAsync(values);
            toast.success("User created");
            setShowCreate(false);
        } catch (err: any) {
            toast.error(err?.message || "Create failed");
        }
    }

    async function onUpdate(values: any) {
        try {
            await updateUser.mutateAsync(values);
            toast.success("User updated");
            setEditingId(null);
        } catch (err: any) {
            toast.error(err?.message || "Update failed");
        }
    }

    async function onDelete(id: string) {
        if (!confirm("Delete this user?")) return;
        try {
            await deleteUser.mutateAsync(id);
            toast.success("User deleted");
        } catch (err: any) {
            toast.error(err?.message || "Delete failed");
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                <div>
                    <Button onClick={() => setShowCreate((s) => !s)}>{showCreate ? "Cancel" : "Add User"}</Button>
                </div>
            </div>

            {showCreate && (
                <div className="rounded-lg border bg-white p-4">
                    <CreateOrEditForm onSubmit={onCreate} submitLabel="Create" />
                </div>
            )}

            <div className="rounded-lg border bg-white p-4">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="text-left text-sm text-muted-foreground">
                            <th className="pb-2">Name</th>
                            <th className="pb-2">Email</th>
                            <th className="pb-2">Role</th>
                            <th className="pb-2">Created</th>
                            <th className="pb-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-t">
                                <td className="py-2">{u.name}</td>
                                <td className="py-2">{u.email}</td>
                                <td className="py-2">{u.role}</td>
                                <td className="py-2">{new Date(u.createdAt).toLocaleString()}</td>
                                <td className="py-2 space-x-2">
                                    <Button size="sm" onClick={() => setEditingId(u._id)}>Edit</Button>
                                    <Button size="sm" variant="destructive" onClick={() => onDelete(u._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Page {data?.page} of {Math.max(1, Math.ceil((data?.total || 0) / (data?.limit || 1)))}</p>
                    <div className="space-x-2">
                        <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                        <Button disabled={(data?.page || 1) * (data?.limit || 1) >= (data?.total || 0)} onClick={() => setPage((p) => p + 1)}>Next</Button>
                    </div>
                </div>

                {editingId && (
                    <div className="mt-4">
                        <h2 className="text-sm font-medium">Edit user</h2>
                        <CreateOrEditForm id={editingId} onSubmit={onUpdate} submitLabel="Update" onCancel={() => setEditingId(null)} />
                    </div>
                )}
            </div>
        </div>
    );
}

function CreateOrEditForm({ id, onSubmit, submitLabel = "Save", onCancel }: any) {
    // If id provided, we can fetch the user client-side or rely on parent data; for simplicity we will fetch
    const [loading, setLoading] = useState(false);
    const [initial, setInitial] = useState<any>({ name: "", email: "", role: "user", password: "" });

    React.useEffect(() => {
        let mounted = true;
        async function load() {
            if (!id) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/users?page=1&limit=100`, { credentials: "include" });
                const data = await res.json();
                const u = data.users.find((x: any) => x._id === id);
                if (u && mounted) setInitial({ name: u.name, email: u.email, role: u.role, password: "" });
            } catch (err) {
                // ignore
            } finally {
                setLoading(false);
            }
        }
        load();
        return () => { mounted = false };
    }, [id]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const payload: any = {
            name: form.get("name"),
            email: form.get("email"),
            role: form.get("role"),
        };
        const password = form.get("password");
        if (password) payload.password = password;
        if (id) payload.id = id;

        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input name="name" defaultValue={initial.name} required />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input name="email" type="email" defaultValue={initial.email} required />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select name="role" defaultValue={initial.role} className="w-full rounded border px-2 py-2">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input name="password" type="password" placeholder={id ? "Leave blank to keep" : "Password"} />
            </div>

            <div className="col-span-full flex items-center gap-2">
                <Button type="submit" disabled={loading}>{submitLabel}</Button>
                {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
            </div>
        </form>
    );
}

"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import { Button } from "@/components/ui/button";
import { AdminUser } from "@/types/admin-user";
import AdminUsersTableSkeleton from "./AdminUsersTableSkeleton";

export default function AdminUsersTable() {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useAdminUsers(page);

    if (isLoading) {
        return <AdminUsersTableSkeleton />;
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.data?.map((user: AdminUser) => (
                        <TableRow key={user._id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <EditUserDialog user={user} />
                                <DeleteUserDialog userId={user._id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === data?.pagination?.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

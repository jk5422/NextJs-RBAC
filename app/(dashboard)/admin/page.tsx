import AdminUsersTable from "@/components/admin/AdminUsersTable";

export default function AdminPage() {
    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">
                Admin Dashboard
            </h1>

            <div className="rounded-lg border bg-white p-4">
                <p className="text-sm text-slate-600">
                    Only admins can see this page.
                </p>
            </div>

            <div className="space-y-4">
                <AdminUsersTable />
            </div>
        </div>
    );
}

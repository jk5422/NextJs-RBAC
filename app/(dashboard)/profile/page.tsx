"use client";

import { useAuthUser } from "@/hooks/useAuthUser";

export default function ProfilePage() {
    const { data: user, isLoading, isError } = useAuthUser();

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">Loading profile...</p>;
    }

    if (isError || !user) return <p>Unable to load profile</p>;

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">My Profile</h1>

            <div className="rounded-lg border bg-white p-4 space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </div>
        </div>
    );
}

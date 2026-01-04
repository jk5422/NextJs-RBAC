import mongoose from "mongoose";
import { User } from "@/models/User";
import { AdminUser } from "@/types/admin-user";

export async function getPaginatedUsers(
    page: number,
    limit: number
): Promise<{ users: AdminUser[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find()
            .select("_id name email role createdAt")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        User.countDocuments(),
    ]);

    return {
        users: users.map((u) => ({
            _id: u._id.toString(),
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt?.toISOString(),
        })),
        total,
    };
}

export async function updateUserById(
    id: string,
    data: { name: string; role: "admin" | "user" }
) {
    return User.findByIdAndUpdate(
        new mongoose.Types.ObjectId(id),
        { $set: data },
        { new: true }
    );
}

export async function deleteUserById(id: string) {
    return User.findByIdAndDelete(new mongoose.Types.ObjectId(id));
}

import { User } from "@/models/User";
import { hashPassword, comparePassword } from "@/lib/password";
import { signToken } from "@/lib/jwt";
import { AdminUser } from "@/types/admin-user";

export async function registerUser(data: Omit<AdminUser, "_id">) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        return null;
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
    });

    return user;
}

export async function loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return null;

    const token = signToken({
        userId: user._id.toString(),
        role: user.role,
    });

    return { user, token };
}

export async function getUserById(userId: string) {
    return User.findById(userId).select("_id name email role");
}

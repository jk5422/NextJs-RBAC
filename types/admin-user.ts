export type UserRole = "admin" | "user";

export interface AdminUser {
    _id: string;
    name: string;
    password?: string;
    email: string;
    role: UserRole;
    createdAt?: string;
}

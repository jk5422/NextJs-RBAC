export type AdminUser = {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
};

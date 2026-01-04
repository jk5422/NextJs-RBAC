import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "Password should be at least 6 character long" }),
    role: z.enum(['admin', 'user'])
})

export const loginSchema = z.object({
    email: z.string({ message: "email is required" }).email(),
    password: z.string().min(6, { message: "Password is required" }),
});
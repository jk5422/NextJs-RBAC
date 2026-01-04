/**
 * POST /api/auth/register
 * This API creates a new user
 */

import { connectDB } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { User } from "@/models/User";
import { registerSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        //  Parse request body
        const body = await req.json();

        // Validate input using Zod
        const parsedData = registerSchema.safeParse(body);
        if (!parsedData.success) {
            return NextResponse.json({ message: "Invalid Inputs Data", errors: parsedData.error.flatten() }, { status: 400 })
        }

        const { name, email, password } = parsedData?.data || {};

        // Connect database
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { name }] });
        if (existingUser) {
            return NextResponse.json({ message: "User Already Exist" }, { status: 409 });
        }

        // hash passoword
        const hashedPassword = await hashPassword(password);

        // create user - enforce role=\"user\" for public registration
        await User.create({ name, email, password: hashedPassword, role: 'user' });

        // send response
        return NextResponse.json({ message: "User Registered Successfully" }, { status: 201 })


    }
    catch (err) {
        console.error("Registration Error :", err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    }
}
/**
 * POST /api/auth/login
 * This API logs user in and sets httpOnly cookie
 */

import { BadRequestError, ForbiddenError } from "@/lib/apiError";
import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { comparePassword } from "@/lib/password";
import { User } from "@/models/User";
import { loginSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        //  Parse request body
        const body = await req.json();

        // Validate input using Zod
        const parsedData = loginSchema.safeParse(body);
        if (!parsedData.success) {
            return BadRequestError('Invalid Inputs Data')
        }

        const { email, password } = parsedData?.data || {};

        // Connect database
        await connectDB();

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return BadRequestError('Invalid email or password');
        }

        // compare passoword
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return BadRequestError('Invalid email or password');
        }

        // create JWT
        const token = signToken({ userId: user._id.toString(), role: user.role });

        // set http-only cookies
        const response = NextResponse.json({
            message: "Login Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }, { status: 200 })

        // Set cookie; enable secure only in production so it works over http in dev
        response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/' });

        return response;

    }
    catch (err) {
        return ForbiddenError('Internal Server Error');
    }
}
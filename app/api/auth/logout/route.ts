import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out Successfully" }, { status: 200 })

    response.cookies.set('token', "", {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    })

    return response;
}
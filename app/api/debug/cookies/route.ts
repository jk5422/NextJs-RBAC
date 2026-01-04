import { NextResponse } from "next/server";

export async function GET(req: Request) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const cookieHeader = req.headers.get('cookie') || '';
    const token = cookieHeader.split('; ').find(c => c.startsWith('token='))?.split('=')[1];

    return NextResponse.json({ cookieHeader, hasToken: Boolean(token) });
}
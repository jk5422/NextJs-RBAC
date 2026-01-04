import { NextResponse } from "next/server";

export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Common errors
export const UnauthorizedError = (errmsg: string = '') =>
    new ApiError(errmsg || "Unauthorized", 401);

export const ForbiddenError = (errmsg: string = '') =>
    new ApiError(errmsg || "Forbidden", 403);

export const BadRequestError = (message = "Bad request") =>
    new ApiError(message, 400);

export const NotFoundError = (message = "Not found") =>
    new ApiError(message, 404);

// Central response handler
export function handleApiError(error: unknown) {
    if (error instanceof ApiError) {
        return NextResponse.json(
            { message: error.message },
            { status: error.statusCode }
        );
    }

    console.error("Unhandled API Error:", error);

    return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
    );
}

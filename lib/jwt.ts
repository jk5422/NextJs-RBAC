import jwt from "jsonwebtoken";

const JWTSECRET = process.env.JWT_SECRET!;
const JWTEXIRE = process.env.JWT_EXPIRES_IN;

/**
 * Create JWT token with user id & role
 */

export function signToken(payload: { userId: string, role: string }) {
    return jwt.sign(payload, JWTSECRET, { expiresIn: JWTEXIRE });
}

/**
 * Verify JWT token
 */

export function verifyToken(token: string) {
    return jwt.verify(token, JWTSECRET);
}
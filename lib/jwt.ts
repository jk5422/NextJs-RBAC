import jwt from "jsonwebtoken";

const JWTSECRET = process.env.JWT_SECRET!;
// Default expiry: in production we recommend short-lived access tokens and refresh tokens
// (e.g. 15m + refresh rotation). For development convenience, default to 7d when
// JWT_EXPIRES_IN is not set.
const JWTEXIRE = process.env.JWT_EXPIRES_IN || (process.env.NODE_ENV === 'production' ? '15m' : '7d');

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
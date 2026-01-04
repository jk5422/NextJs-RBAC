export type DecodedToken = {
    userId: string;
    role: "admin" | "user";
    exp?: number;
};

// NOTE: `decodeToken` does a non-verified payload decode and is *only* suitable
// for non-security-related tasks (e.g., debugging, UI hints). Do NOT use it for
// authorization or RBAC decisions. Always use `verifyToken` (server-side) to make
// authoritative security checks that validate the token signature and expiry.
export function decodeToken(token: string): DecodedToken | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        // ✅ Robust base64url decode (handles JWT base64url encoding and padding)
        const base64UrlToBase64 = (str: string) => {
            str = str.replace(/-/g, "+").replace(/_/g, "/");
            while (str.length % 4 !== 0) {
                str += "=";
            }
            return str;
        };

        const decodedPayload = JSON.parse(atob(base64UrlToBase64(payload)));

        return decodedPayload;
    } catch {
        return null;
    }
}

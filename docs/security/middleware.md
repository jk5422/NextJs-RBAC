# Middleware security guidance

This file explains why the navigation middleware (`middleware.ts`) intentionally avoids making security-critical authorization decisions based on decoded (but **unverified**) JWT payloads.

## Key points

- The `middleware` runs at the Edge/browser navigation layer and is mainly responsible for client navigation behavior (e.g., redirecting unauthenticated users away from protected pages).
- It performs presence checks of the auth cookie (e.g., `token`) to decide whether to redirect to `/login` for protected routes.
- **It does not verify the JWT signature** or rely on the token payload for RBAC decisions (e.g., `role === 'admin'`).

## Why not decode and check role here?

- Decoding the JWT payload without verifying its signature is insecure: an attacker can craft a fake token and bypass role checks.
- The Edge runtime may not have access to the same server-side secret, and libraries that verify JWTs may not be available/compatible in the Edge environment.

## Proper place for RBAC decisions

- Server-side layouts (e.g., `app/(dashboard)/admin/layout.tsx`) and API routes should call `verifyToken` (which checks the JWT signature and expiry) to perform authoritative RBAC checks.
- This provides defense-in-depth: middleware handles navigation flow, server-side code enforces security.

## How to test locally

1. As an unauthenticated user try to open `/admin` → you should be redirected to `/login`.
2. As an authenticated non-admin, try to open `/admin` → the **server** (admin layout or API) should redirect you to `/profile`.
3. As an authenticated admin, you should be able to access `/admin`.

If you want middleware to perform signature verification in the Edge, consider using an Edge-compatible JWT library (e.g., `jose`) and ensure secrets are available; this is more complex and will be handled as a separate milestone.
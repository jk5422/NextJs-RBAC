# Milestone 2 — Server RBAC utilities & Admin Users API

## What I implemented

1. **`requireAdminFromRequest`** — a server-side helper in `lib/authMiddleware.ts` that:
   - Extracts and verifies the JWT from the request cookie.
   - Throws `Unauthorized` if missing or invalid, `Forbidden` if the role is not `admin`.

2. **Admin users API** — `app/api/admin/users/route.ts` (methods: `GET`, `POST`, `PATCH`, `DELETE`)
   - All methods call `requireAdminFromRequest(req)` to ensure only admins can use these endpoints.
   - `GET`: paginated list via `?page=1&limit=10` (response: `{ users, total, page, limit }`).
   - `POST`: create a user (validates using zod); allows creating admins.
   - `PATCH`: update user fields (name/email/role/password) by `id` in body.
   - `DELETE`: delete user by `id` passed as query param `?id=<id>`.

3. **Schemas & validation** — `zod` schemas inside the route validate inputs and return consistent `400` responses on errors.

## How to test manually (quick)

- Create an admin user via `/api/auth/register` (if you allow admin role during register), or seed an admin in DB.
- Login as admin (POST `/api/auth/login`) and ensure the `token` cookie is present.
- Call GET `/api/admin/users?page=1&limit=10` — should return a paginated user list.
- Call POST `/api/admin/users` with JSON `{ name, email, password, role }` — should create a user.
- Call PATCH `/api/admin/users` with JSON `{ id, name }` — updates user.
- Call DELETE `/api/admin/users?id=<id>` — deletes user.

If you call any admin API without an admin token, you should receive `401/403` responses.

## Notes and next steps
- Rate limiting is not yet implemented for these endpoints (future milestone).
- We should add tests (unit/integration) that perform the exact flows above; I can add test scaffolding next.
- Later we can add audit logs (which admin performed which action) and soft-deletes instead of hard deletes.

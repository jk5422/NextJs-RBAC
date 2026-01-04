# Milestone: Admin UI (User listing & CRUD)

## What I implemented

- Server-side admin layout: `app/(dashboard)/admin/layout.tsx` ensures only admin users can reach the admin pages (reads httpOnly cookie and verifies JWT server-side).
- Admin users APIs: `app/api/admin/users/route.ts` (GET paginated, POST create, PATCH update, DELETE remove) — all require admin token.
- Client-side admin UI: `components/admin/UserTable.tsx` — uses shadcn-style components (`Button`, `Input`, `Form`) and Tailwind to render a user listing table, create form, edit form, delete actions, and pagination.
- Data hooks: `hooks/useAdminUsers.ts` (query) and `hooks/useAdminUserMutations.ts` (create/update/delete) using React Query and `credentials: 'include'`.
- Public registration now enforces `role: 'user'` to prevent unauthorized admin creation.

## How to test

1. Start the app locally.
2. Create an admin user (seed DB or manually set role in DB) and login (POST `/api/auth/login`). Ensure `token` cookie is set.
3. As admin, open `/admin` → you should see the user table (paginated), and be able to create, edit and delete users.
4. As a non-admin user (or unauthenticated), opening `/admin` in the browser should redirect you to `/profile` or `/login` depending on auth state.

## Implementation notes (short)

- Server-side protection is authoritative: the layout uses `verifyToken` to check signature and role — this prevents client-side URL tampering bypass.
- Client UI uses React Query for data fetching and to keep UI snappy; mutations invalidate the users query on success.
- All state-changing requests include `credentials: 'include'` so the httpOnly cookie is sent and server verifies the token.

If you want, next I can:
- Add unit/integration tests for admin APIs and middleware (recommended). ✅
- Improve UI with modals and richer shadcn components (sorting, search, column layout). 🎨
- Add audit logs and soft delete instead of hard delete for safer ops. 🔐

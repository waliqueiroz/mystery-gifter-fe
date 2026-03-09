# T008 — GuestGuard component (redirect authenticated users away from login/register)

**Story**: Foundational
**Branch**: `task/001-T008-guest-guard`
**Stack on**: `task/001-T002-auth-lib`
**Parallel**: Yes (alongside T007, different file)

## Goal

Create the `GuestGuard` client component that wraps public-only pages (login, registro, landing). On mount, if JWT is present, redirects to `/dashboard`. Prevents already-authenticated users from re-accessing login or register.

## Files

- `src/components/auth/GuestGuard.tsx` — `"use client"`; uses `useEffect` + `useRouter`; calls `isAuthenticated()` from `src/lib/auth.ts`
- `src/components/auth/GuestGuard.test.tsx` — tests: renders children when no token, redirects to `/dashboard` when token present, renders null during check

## Acceptance Criteria

- [ ] Redirects to `/dashboard` when token is present
- [ ] Renders children when no token present
- [ ] Returns `null` before hydration check completes
- [ ] `npm test src/components/auth/GuestGuard.test.tsx` passes

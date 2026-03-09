# T007 — AuthGuard component (protect dashboard from unauthenticated users)

**Story**: Foundational
**Branch**: `task/001-T007-auth-guard`
**Stack on**: `task/001-T002-auth-lib`
**Parallel**: Yes

## Goal

Create the `AuthGuard` client component that wraps protected pages. On mount, reads the JWT from localStorage; if absent, redirects to `/login`. Renders `null` while checking (avoids flash of protected content).

## Files

- `src/components/auth/AuthGuard.tsx` — `"use client"` component; uses `useEffect` + `useRouter`; calls `isAuthenticated()` from `src/lib/auth.ts`
- `src/components/auth/AuthGuard.test.tsx` — tests: renders children when token present, redirects to `/login` when no token, renders null during check

## Acceptance Criteria

- [ ] Redirects to `/login` when `localStorage` has no token (tested with mock)
- [ ] Renders children when token is present
- [ ] Returns `null` before hydration check completes (no flash)
- [ ] `npm test src/components/auth/AuthGuard.test.tsx` passes

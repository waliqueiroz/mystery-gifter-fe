# T013 — Dashboard page + AdminLTE layout + DashboardContent (US4)

**Story**: US4 — Authenticated User Views Dashboard and Logs Out
**Branch**: `task/001-T013-dashboard-page`
**Stack on**: `task/001-T009-route-groups`
**Parallel**: Yes (alongside T010, T011, T012 — different files)

## Goal

Implement the AdminLTE-based dashboard layout with a top navigation bar, logout button, and the dummy dashboard content ("O melhor está por vir"). Wrap in `AuthGuard`.

## Files

- `src/app/(protected)/layout.tsx` — `"use client"`; AdminLTE `.wrapper` structure: `<nav>` (top bar with logout) + `<div className="content-wrapper">`; calls `clearToken()` + `router.push('/login')` on logout
- `src/components/dashboard/DashboardContent.tsx` — renders AdminLTE `.content` with placeholder heading "O melhor está por vir" and a supporting subtext
- `src/components/dashboard/DashboardContent.test.tsx` — tests: renders "O melhor está por vir", renders page
- `src/components/dashboard/AdminLTELayout.test.tsx` — tests: renders children, calls clearToken and redirects on logout click
- `src/app/(protected)/dashboard/page.tsx` — replace placeholder; wrap `DashboardContent` in `AuthGuard`

## Acceptance Criteria

- [ ] Authenticated user sees "O melhor está por vir" on `/dashboard`
- [ ] Logout button calls `clearToken()` and redirects to `/login`
- [ ] Unauthenticated access to `/dashboard` redirects to `/login` (AuthGuard)
- [ ] `npm test src/components/dashboard/` passes
- [ ] AdminLTE CSS classes applied (`.wrapper`, `.content-wrapper`, `.main-header`)

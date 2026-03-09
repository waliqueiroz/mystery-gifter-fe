# T002 — Auth helpers (getToken / setToken / clearToken)

**Story**: Foundational
**Branch**: `task/001-T002-auth-lib`
**Stack on**: `task/001-T001-project-setup`
**Parallel**: Yes

## Goal

Create the auth utility library with token management functions and unit tests. All components that need JWT will use this module — it is the single source of truth for localStorage access.

## Files

- `src/lib/auth.ts` — export: `TOKEN_KEY`, `getToken()`, `setToken(token)`, `clearToken()`, `isAuthenticated()`
- `src/lib/auth.test.ts` — unit tests: each function tested; localStorage mocked

Key rule: `getToken()` must guard against SSR (`typeof window === 'undefined'`).

## Acceptance Criteria

- [ ] All 4 functions exported and typed
- [ ] `getToken()` returns `null` when `window` is undefined (SSR safety)
- [ ] `npm test src/lib/auth.test.ts` passes
- [ ] 100% line coverage on `src/lib/auth.ts`

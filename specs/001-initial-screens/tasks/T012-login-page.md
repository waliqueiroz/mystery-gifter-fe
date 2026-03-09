# T012 — Login page + LoginForm component (US3)

**Story**: US3 — User Logs In
**Branch**: `task/001-T012-login-page`
**Stack on**: `task/001-T009-route-groups`
**Parallel**: Yes (alongside T010, T011, T013 — different files)

## Goal

Implement the login screen with e-mail and password fields. On success: store JWT + redirect to `/dashboard`. On failure: inline error. Wrap in `GuestGuard`.

## Files

- `src/components/login/LoginForm.tsx` — `"use client"`; uses `FormField` + `Button`; calls `login()` from `authService`; calls `setToken()` then `router.push('/dashboard')` on success
- `src/components/login/LoginForm.test.tsx` — tests: renders email + password fields, shows error when fields empty (no API call), calls authService.login on valid submit, redirects to /dashboard on success, shows "E-mail ou senha inválidos." on 401
- `src/app/(public)/login/page.tsx` — replace placeholder; wrap `LoginForm` in `GuestGuard`

## Acceptance Criteria

- [ ] `npm test src/components/login/LoginForm.test.tsx` passes
- [ ] Empty field submission shows inline error without calling API
- [ ] Successful login redirects to `/dashboard`
- [ ] 401 shows "E-mail ou senha inválidos."
- [ ] All labels/placeholders/errors in pt-BR
- [ ] Link "Não tem conta? Criar conta" navigates to `/registro`

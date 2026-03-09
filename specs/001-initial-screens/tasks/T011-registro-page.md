# T011 — Registration page + RegisterForm component (US2)

**Story**: US2 — New User Registers
**Branch**: `task/001-T011-registro-page`
**Stack on**: `task/001-T009-route-groups`
**Parallel**: Yes (alongside T010, T012, T013 — different files)

## Goal

Implement the registration screen with a Bootstrap 4 form collecting nome, sobrenome, e-mail, senha, confirmação de senha. Client-side validation runs before API call. On success: auto-login (two API calls) + redirect to `/dashboard`. On failure: inline error message.

## Files

- `src/components/register/RegisterForm.tsx` — `"use client"`; uses `FormField` + `Button`; calls `register()` from `authService`; calls `setToken()` then `router.push('/dashboard')` on success
- `src/components/register/RegisterForm.test.tsx` — tests: renders all 5 fields, shows error when passwords don't match (no API call), shows error when any field empty, calls authService.register on valid submit, redirects to /dashboard on success, shows API error on failure
- `src/app/(public)/registro/page.tsx` — replace placeholder; wrap `RegisterForm` in `GuestGuard`

## Validation rules (client-side, before API call)

- All fields non-empty
- `senha` ≥ 8 characters
- `confirmação de senha` === `senha`

## Acceptance Criteria

- [ ] `npm test src/components/register/RegisterForm.test.tsx` passes
- [ ] Submitting with mismatched passwords shows inline error, no API call made
- [ ] Successful registration redirects to `/dashboard`
- [ ] 409 from API shows "Este e-mail já está em uso."
- [ ] All labels/placeholders/errors in pt-BR
- [ ] Link "Já tem conta? Entrar" navigates to `/login`

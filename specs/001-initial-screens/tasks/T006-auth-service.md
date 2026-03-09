# T006 — Auth service (login + register API calls)

**Story**: Foundational
**Branch**: `task/001-T006-auth-service`
**Stack on**: `task/001-T001-project-setup`
**Parallel**: Yes

## Goal

Create the auth service with `login()` and `register()` functions that call the backend REST API. `register()` performs two calls: create user then auto-login. All errors are mapped to user-friendly pt-BR messages.

## Files

- `src/services/api/authService.ts` — export: `login(credentials)`, `register(payload)`. Both return `AuthSession`. Use `fetch` with `/api/v1/...` (proxied via Next.js rewrites).
- `src/services/api/authService.test.ts` — unit tests with mocked `fetch`: login success, login 401, register success (mock both calls), register 409 (email taken), network error

## Key logic

`register()` must:
1. `POST /api/v1/users` — if not 201, throw with mapped error
2. `POST /api/v1/login` — return `AuthSession`

Error code mapping (pt-BR): `409` → "Este e-mail já está em uso.", `401` → "E-mail ou senha inválidos.", generic → "Ocorreu um erro. Tente novamente."

## Acceptance Criteria

- [ ] `login()` returns `AuthSession` on success, throws mapped error on failure
- [ ] `register()` makes two sequential fetch calls and returns `AuthSession`
- [ ] `register()` throws "Este e-mail já está em uso." on 409
- [ ] `npm test src/services/api/authService.test.ts` passes
- [ ] No `any` types; all functions fully typed using `src/types/api.ts`

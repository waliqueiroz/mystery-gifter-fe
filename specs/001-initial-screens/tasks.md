# Tasks: Mystery Gifter — Initial Screens (001)

**Input**: Design documents from `/specs/001-initial-screens/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Unit tests for all React components and utility functions are MANDATORY per constitution Principle II.
**Branch pattern**: Stacked branches — `task/001-T00n-description`. Stack diagram e git commands na seção "Dependencies & Execution Order" abaixo.

---

## Phase 1: Setup

**Purpose**: Full project toolchain in a single PR with one commit per concern.
**Branch**: `task/001-T001-project-setup` (stacked on `feature/001-initial-screens`)

> ⚠️ All subsequent tasks depend on this phase being merged into `feature/001-initial-screens`.

- [x] T001 Configure full project toolchain (TypeScript strict + ESLint + Prettier + Jest + AdminLTE/Bootstrap + env + types) — 5 commits:
  - **Commit 1** `chore(setup): enable TypeScript strict mode and configure ESLint + Prettier` — `tsconfig.json` (`noUncheckedIndexedAccess`), `.prettierrc`, `.prettierignore`, `package.json` (add `type-check` + `format` scripts, install `prettier`)
  - **Commit 2** `chore(setup): add Jest + React Testing Library with ts-jest` — `jest.config.ts` (jsdom, ts-jest, `@/` alias, 80% coverage), `jest.setup.ts`, `__mocks__/styleMock.ts`, `package.json` (add `test` + `test:coverage` scripts, install jest + RTL deps)
  - **Commit 3** `chore(setup): install AdminLTE 3.2, Bootstrap 4.6, Font Awesome, jQuery` — `package.json` (install `admin-lte@3.2`, `bootstrap@4.6`, `@fortawesome/fontawesome-free`, `jquery`, `@types/jquery`)
  - **Commit 4** `chore(setup): add env config and Next.js API proxy rewrites` — `.env.local` (not committed), `.env.local.example` (committed), `.gitignore` (verify `.env.local` listed), `next.config.ts` (add `rewrites()` proxying `/api/v1/:path*` → backend)
  - **Commit 5** `chore(setup): define shared TypeScript API and form types` — `src/types/api.ts` (AuthSession, User, ApiError, LoginCredentials, CreateUserPayload), `src/types/forms.ts` (LoginFormData, RegisterFormData) — see `data-model.md` for exact fields

**Acceptance**: `npm run type-check` ✅ `npm run lint` ✅ `npm test` ✅ `npm run build` ✅ `node_modules/bootstrap` is v4.x ✅ `.env.local` not tracked ✅

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user stories. All depend on T001.

**⚠️ CRITICAL**: Create task branches AFTER T001 PR is merged into `feature/001-initial-screens`.

- [x] T002 [P] Create auth token helpers in `src/lib/auth.ts` + `src/lib/auth.test.ts`
  - Branch: `task/001-T002-auth-lib` (stacked on T001)
  - `src/lib/auth.ts`: export `TOKEN_KEY = 'mystery_gifter_token'`, `getToken()` (SSR-safe: guard `typeof window === 'undefined'`), `setToken(token)`, `clearToken()`, `isAuthenticated()`
  - `src/lib/auth.test.ts`: unit tests for all 4 functions with localStorage mocked; 100% line coverage
  - **Acceptance**: `npm test src/lib/auth.test.ts` passes; `getToken()` returns `null` server-side

- [x] T003 [P] Update root layout with Bootstrap 4 + AdminLTE CSS in `src/app/layout.tsx` + `src/app/globals.css`
  - Branch: `task/001-T003-root-layout` (stacked on T001)
  - `src/app/globals.css`: replace content with Bootstrap 4 + AdminLTE 3.2 CSS imports
  - `src/app/layout.tsx`: set `<html lang="pt-BR">`, update metadata (title: "Mystery Gifter"), remove Geist font imports
  - **Acceptance**: Bootstrap 4 CSS loads; AdminLTE `.content-wrapper` class available; no Tailwind/Geist refs; `npm run build` ✅

- [x] T004 [P] Create FormField shared component in `src/components/ui/FormField/FormField.tsx` + `FormField.test.tsx`
  - Branch: `task/001-T004-ui-formfield` (stacked on T001)
  - Props: `{ id, label, type?, value, onChange, error?, placeholder?, required? }`
  - Renders Bootstrap 4 `.form-group` with `label`, `input.form-control`, optional `.invalid-feedback` + `.is-invalid`
  - Tests: renders label, renders input, shows error when provided, hides error when absent
  - **Acceptance**: `npm test src/components/ui/FormField/FormField.test.tsx` passes

- [x] T005 [P] Create Button shared component in `src/components/ui/Button/Button.tsx` + `Button.test.tsx`
  - Branch: `task/001-T005-ui-button` (stacked on T001)
  - Props: `{ children, type?, variant?: 'primary'|'secondary'|'danger', loading?, disabled?, onClick?, className? }`
  - When `loading=true`: button disabled + spinner with `aria-label="Carregando"`
  - Tests: renders text, shows spinner when loading, disables when loading, calls onClick, does not call onClick when disabled
  - **Acceptance**: `npm test src/components/ui/Button/Button.test.tsx` passes

- [x] T006 [P] Create auth service in `src/services/api/authService.ts` + `authService.test.ts`
  - Branch: `task/001-T006-auth-service` (stacked on T001)
  - `login(credentials: LoginCredentials): Promise<AuthSession>` — `POST /api/v1/login`
  - `register(payload: CreateUserPayload): Promise<AuthSession>` — two sequential calls: `POST /api/v1/users` (201) → `POST /api/v1/login`
  - Error mapping (pt-BR): `409` → "Este e-mail já está em uso.", `401` → "E-mail ou senha inválidos.", generic → "Ocorreu um erro. Tente novamente."
  - Tests with mocked `fetch`: login success, login 401, register success, register 409, network error
  - **Acceptance**: `npm test src/services/api/authService.test.ts` passes; no `any` types

- [x] T007 [P] Create AuthGuard component in `src/components/auth/AuthGuard.tsx` + `AuthGuard.test.tsx`
  - Branch: `task/001-T007-auth-guard` (stacked on T002)
  - `"use client"` — reads `isAuthenticated()` in `useEffect`; if no token → `router.push('/login')`; renders `null` during check
  - Tests: renders children when token present, redirects to `/login` when no token, returns null during check
  - **Acceptance**: `npm test src/components/auth/AuthGuard.test.tsx` passes

- [x] T008 [P] Create GuestGuard component in `src/components/auth/GuestGuard.tsx` + `GuestGuard.test.tsx`
  - Branch: `task/001-T008-guest-guard` (stacked on T002, parallel with T007)
  - `"use client"` — if `isAuthenticated()` → `router.push('/dashboard')`; renders `null` during check
  - Tests: renders children when no token, redirects to `/dashboard` when token present, returns null during check
  - **Acceptance**: `npm test src/components/auth/GuestGuard.test.tsx` passes

- [x] T009 Create App Router route groups skeleton
  - Branch: `task/001-T009-route-groups` (stacked on T003)
  - Create: `src/app/(public)/page.tsx` (placeholder `<main>Em construção</main>`), `src/app/(public)/login/page.tsx`, `src/app/(public)/register/page.tsx`, `src/app/(protected)/layout.tsx` (minimal `"use client"` returning `<>{children}</>`), `src/app/(protected)/dashboard/page.tsx`
  - Delete: `src/app/page.tsx`, `src/app/page.module.css`
  - **Acceptance**: `/`, `/login`, `/register`, `/dashboard` all resolve; `npm run build` ✅

**Checkpoint**: Foundation complete — user story branches can now be created in parallel.

---

## Phase 3: User Story 1 — Visitor Discovers Mystery Gifter (P1)

**Goal**: Public landing page with brand name, product description, and two CTAs (Entrar / Criar conta).
**Independent Test**: Navigate `/` without session → landing renders "Mystery Gifter" + both CTAs
**Branch**: `task/001-T010-landing-page` (stacked on T009, parallel with T011/T012/T013)

- [ ] T010 [P] [US1] Implement HeroSection component + landing page in `src/components/landing/HeroSection.tsx`, `HeroSection.test.tsx`, and `src/app/(public)/page.tsx`
  - `HeroSection.tsx`: Bootstrap 4 hero section, `<h1>Mystery Gifter</h1>`, product description (pt-BR), `<Link href="/login" className="btn btn-primary">Entrar</Link>`, `<Link href="/register" className="btn btn-outline-primary">Criar conta</Link>`, responsive Bootstrap 4 grid
  - `HeroSection.test.tsx`: renders "Mystery Gifter", renders "Entrar" link to /login, renders "Criar conta" link to /register
  - `src/app/(public)/page.tsx`: import HeroSection + wrap in GuestGuard (Server Component — GuestGuard is "use client" internally)
  - **Acceptance**: `npm test src/components/landing/HeroSection.test.tsx` passes; all text pt-BR; authenticated user redirected to `/dashboard`

---

## Phase 4: User Story 2 — New User Registers (P1)

**Goal**: Registration form with 5 fields, client-side validation, auto-login after success.
**Independent Test**: Submit valid form → two API calls → redirected to `/dashboard`
**Branch**: `task/001-T011-register-page` (stacked on T009, parallel with T010/T012/T013)

- [ ] T011 [P] [US2] Implement RegisterForm component + register page in `src/components/register/RegisterForm.tsx`, `RegisterForm.test.tsx`, and `src/app/(public)/register/page.tsx`
  - `RegisterForm.tsx`: `"use client"`, uses FormField + Button, fields: nome, sobrenome, e-mail, senha, confirmação de senha
  - Client-side validation (before API call): all fields non-empty; senha ≥ 8 chars; confirmação === senha
  - On success: `register(payload)` → `setToken(session.access_token)` → `router.push('/dashboard')`
  - On failure: show inline error; 409 → "Este e-mail já está em uso."
  - Footer link: "Já tem conta? Entrar" → `/login`
  - `RegisterForm.test.tsx`: renders all 5 fields, shows error on mismatched passwords (no API call), shows error when fields empty, calls authService.register on valid submit, redirects to /dashboard on success, shows API error on failure
  - `src/app/(public)/register/page.tsx`: replace placeholder; wrap RegisterForm in GuestGuard
  - **Acceptance**: `npm test src/components/register/RegisterForm.test.tsx` passes; all labels/errors pt-BR

---

## Phase 5: User Story 3 — User Logs In (P1)

**Goal**: Login form with email + password, JWT stored, redirect to dashboard.
**Independent Test**: Submit valid credentials → `mystery_gifter_token` set in localStorage → `/dashboard`
**Branch**: `task/001-T012-login-page` (stacked on T009, parallel with T010/T011/T013)

- [x] T012 [P] [US3] Implement LoginForm component + login page in `src/components/login/LoginForm.tsx`, `LoginForm.test.tsx`, and `src/app/(public)/login/page.tsx`
  - `LoginForm.tsx`: `"use client"`, uses FormField + Button, fields: e-mail, senha
  - Client-side validation: both fields non-empty before calling API
  - On success: `login(credentials)` → `setToken(session.access_token)` → `router.push('/dashboard')`
  - On 401: show "E-mail ou senha inválidos."
  - Footer link: "Não tem conta? Criar conta" → `/register`
  - `LoginForm.test.tsx`: renders email + password fields, shows error when fields empty (no API call), calls authService.login on valid submit, redirects to /dashboard on success, shows "E-mail ou senha inválidos." on 401
  - `src/app/(public)/login/page.tsx`: replace placeholder; wrap LoginForm in GuestGuard
  - **Acceptance**: `npm test src/components/login/LoginForm.test.tsx` passes; all labels/errors pt-BR

---

## Phase 6: User Story 4 — Authenticated User Views Dashboard and Logs Out (P2)

**Goal**: AdminLTE dashboard layout with logout button + placeholder content.
**Independent Test**: Access `/dashboard` with token → sees "O melhor está por vir" + logout clears token + redirects to `/login`
**Branch**: `task/001-T013-dashboard-page` (stacked on T009, parallel with T010/T011/T012)

- [x] T013 [P] [US4] Implement AdminLTE dashboard layout + DashboardContent in `src/app/(protected)/layout.tsx`, `src/components/dashboard/DashboardContent.tsx`, `DashboardContent.test.tsx`, `AdminLTELayout.test.tsx`, and `src/app/(protected)/dashboard/page.tsx`
  - `src/app/(protected)/layout.tsx`: `"use client"`, AdminLTE `.wrapper` structure: `<nav className="main-header">` (logout button) + `<div className="content-wrapper">{children}</div>`; logout: `clearToken()` → `router.push('/login')`
  - `src/components/dashboard/DashboardContent.tsx`: AdminLTE `.content` with `<h1>O melhor está por vir</h1>` + supporting subtext (pt-BR)
  - `DashboardContent.test.tsx`: renders "O melhor está por vir", renders page
  - `AdminLTELayout.test.tsx`: renders children, calls clearToken and redirects to /login on logout click
  - `src/app/(protected)/dashboard/page.tsx`: replace placeholder; wrap DashboardContent in AuthGuard
  - **Acceptance**: `npm test src/components/dashboard/` passes; AdminLTE classes `.wrapper`, `.content-wrapper`, `.main-header` applied

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: All depend on T001 being merged — BLOCKS all user stories
  - T002, T003, T004, T005, T006 → parallel after T001 merged
  - T007, T008 → after T002 merged
  - T009 → after T003 merged
- **Phase 3–6 (User Stories)**: T010, T011, T012, T013 → all parallel after T009 merged

### Branch Stack Reference

```
feature/001-initial-screens
└── T001-project-setup
    ├── T002-auth-lib
    │   ├── T007-auth-guard
    │   └── T008-guest-guard
    ├── T003-root-layout
    │   └── T009-route-groups
    │       ├── T010-landing-page    [US1]
    │       ├── T011-register-page   [US2]
    │       ├── T012-login-page      [US3]
    │       └── T013-dashboard-page  [US4]
    ├── T004-ui-formfield
    ├── T005-ui-button
    └── T006-auth-service
```

### Parallel Opportunities

- T002, T003, T004, T005, T006 — parallel (different files, all on T001)
- T007, T008 — parallel (different files, both on T002)
- T010, T011, T012, T013 — parallel (different files, all on T009)

---

## Implementation Strategy

### MVP Scope (Phase 1 + 2 + 3)

1. Merge T001 → all toolchain ready
2. Merge T002–T006 in parallel → auth + UI primitives ready
3. Merge T007–T009 → guards + routing ready
4. Merge T010 → landing page live (**US1 MVP complete**)

### Incremental Delivery

After MVP: add T011 (register), T012 (login), T013 (dashboard) — each independently testable.

---

## Notes

- All UI text MUST be in pt-BR
- `"use client"` required for: guards, forms, anything using useState/useEffect/localStorage
- API calls go through Next.js proxy (`/api/v1/*` → backend) — no explicit API route handlers
- JWT stored in `localStorage` key `mystery_gifter_token`
- Auto-login after registration = two calls: `POST /api/v1/users` → `POST /api/v1/login`
- AdminLTE requires Bootstrap 4 (NOT Bootstrap 5)
- Test files co-located with source (no `__tests__` subdirectories per constitution)

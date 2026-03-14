# Implementation Plan: Mystery Gifter — Initial Screens

**Branch**: `feature/001-initial-screens` | **Date**: 2026-03-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-initial-screens/spec.md`

## Summary

Build the four initial screens of Mystery Gifter — landing page, registration, login, and
dummy dashboard — as a Next.js 15 App Router frontend. The UI uses AdminLTE 3.2 (Bootstrap 4)
for the dashboard and Bootstrap 4 for public screens. Auth is JWT-based (stored in
localStorage); route guards are client-side. The backend REST API already exists and is
consumed directly via a Next.js rewrites proxy for development.

## Technical Context

**Language/Version**: TypeScript 5+, Node.js LTS v20+, Next.js 15.5.4 (App Router)
**Primary Dependencies**: AdminLTE 3.2, Bootstrap 4.6, Font Awesome (free), jQuery (AdminLTE
  CSS requirement), Jest + React Testing Library
**Storage**: `localStorage` — JWT `access_token` stored under key `mystery_gifter_token`
**Testing**: Jest + `jest-environment-jsdom` + React Testing Library + ts-jest
**Target Platform**: Modern web browsers, desktop (≥1024 px) and mobile (≤768 px)
**Project Type**: Web application — purely frontend; backend API is pre-existing
**Performance Goals**: LCP ≤ 2.5 s desktop / ≤ 4.0 s mobile, CLS ≤ 0.1, INP ≤ 200 ms
**Constraints**: JWT in localStorage (no Set-Cookie from backend); no middleware-based
  auth guard; Bootstrap 4 (not 5) required by AdminLTE 3.2
**Scale/Scope**: 4 screens MVP; single developer; ~15–20 components

## Constitution Check

*GATE: Verified before Phase 0 research. Re-checked post-design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality — TypeScript strict, ESLint, Prettier | ✅ Pass | Enforced from initial setup |
| II. Unit Testing — all components, min 80% coverage | ✅ Pass | Jest + RTL added in setup phase |
| III. UX Consistency — design tokens, loading/error states, a11y | ✅ Pass | Bootstrap 4 + AdminLTE provide the design system |
| IV. Performance Standards — LCP, CLS, INP targets | ✅ Pass | Next.js Image, code-split by route (default) |
| V. Next.js Best Practices — App Router, Server Components default | ⚠️ Justified exception | See Complexity Tracking |

## Project Structure

### Documentation (this feature)

```text
specs/001-initial-screens/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── api-contracts.md # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (public)/                    # Route group — Bootstrap-only pages
│   │   ├── page.tsx                 # Landing page: /
│   │   ├── login/
│   │   │   └── page.tsx             # Login page: /login
│   │   └── registro/
│   │       └── page.tsx             # Registration page: /registro
│   ├── (protected)/                 # Route group — AdminLTE layout
│   │   ├── layout.tsx               # AdminLTE shell (sidebar + topbar) "use client"
│   │   └── dashboard/
│   │       └── page.tsx             # Dashboard: /dashboard "use client"
│   ├── layout.tsx                   # Root layout — global CSS imports
│   └── globals.css                  # AdminLTE + Bootstrap 4 CSS imports
├── components/
│   ├── ui/                          # Shared primitives (constitution: src/components/ui/)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   └── FormField/
│   │       ├── FormField.tsx
│   │       └── FormField.test.tsx
│   ├── auth/
│   │   ├── AuthGuard.tsx            # "use client" — protects /dashboard
│   │   ├── AuthGuard.test.tsx
│   │   ├── GuestGuard.tsx           # "use client" — redirects auth users away from login/register
│   │   └── GuestGuard.test.tsx
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   └── HeroSection.test.tsx
│   ├── login/
│   │   ├── LoginForm.tsx            # "use client"
│   │   └── LoginForm.test.tsx
│   ├── register/
│   │   ├── RegisterForm.tsx         # "use client"
│   │   └── RegisterForm.test.tsx
│   └── dashboard/
│       ├── DashboardContent.tsx
│       ├── DashboardContent.test.tsx
│       ├── AdminLTELayout.tsx       # "use client"
│       └── AdminLTELayout.test.tsx
├── services/
│   └── api/
│       ├── authService.ts           # login(), register() API calls
│       └── authService.test.ts
├── lib/
│   ├── auth.ts                      # getToken(), setToken(), clearToken(), isAuthenticated()
│   └── auth.test.ts
└── types/
    ├── api.ts                       # AuthSession, User, LoginCredentials, CreateUserPayload, ApiError
    └── forms.ts                     # LoginFormData, RegisterFormData
```

**Structure Decision**: Single Next.js project using App Router route groups. Route group
`(public)` contains Bootstrap 4 styled public pages; `(protected)` contains AdminLTE 3.2
styled authenticated pages. This cleanly separates CSS concerns without URL pollution.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| Principle V: Protected pages use `"use client"` instead of Server Components | JWT stored in localStorage is inaccessible server-side; auth guard must run in the browser | Using cookies would require backend changes (out of scope); middleware cannot read localStorage |
| Two API calls for auto-login | Backend `POST /api/v1/users` returns `UserDTO` (no JWT); auto-login requires a follow-up `POST /api/v1/login` | Backend cannot be changed; this is the correct approach |

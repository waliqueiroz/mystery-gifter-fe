# mystery-gifter-fe Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-08

## Active Technologies
- TypeScript 5+, Node.js LTS + Next.js 15.5.4, Bootstrap 4.6, AdminLTE 3.2, Font Awesome Free (002-dark-theme-redesign)
- N/A (styling-only feature) (002-dark-theme-redesign)

- **Framework**: Next.js 15.5.4, App Router, React 19, TypeScript 5+
- **UI**: AdminLTE 3.2 (dashboard), Bootstrap 4.6 (public pages), Font Awesome (free)
- **Auth**: JWT in `localStorage` (key: `mystery_gifter_token`); Bearer token for API calls
- **Testing**: Jest + jest-environment-jsdom + React Testing Library + ts-jest
- **Backend API**: `http://localhost:8080/api/v1` (proxied via Next.js rewrites in dev)

## Project Structure

```text
src/
├── app/
│   ├── (public)/            # Landing, login, register — Bootstrap 4 pages
│   ├── (protected)/         # Dashboard — AdminLTE layout
│   ├── layout.tsx            # Root layout, global CSS
│   └── globals.css
├── components/
│   ├── ui/                  # Shared primitives — ALL must have unit tests
│   ├── auth/                # AuthGuard, GuestGuard ("use client")
│   ├── landing/
│   ├── login/
│   ├── register/
│   └── dashboard/
├── services/api/            # API call functions
├── lib/                     # auth.ts (getToken, setToken, clearToken)
└── types/                   # api.ts, forms.ts
```

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm test             # Run Jest unit tests
npm run test:coverage # Coverage report (must be ≥80% for modified components)
npm run lint         # ESLint
npm run build        # Production build (must succeed before PR)
```

## Key Rules (from Constitution v1.1.1)

- Every React component and utility function MUST have a unit test — no exceptions
- All UI text MUST be in Brazilian Portuguese (pt-BR)
- Route segments (URL paths) MUST be in English — e.g., `/register` not `/registro`; only UI labels are pt-BR
- Spec files, checklists, plans, and all speckit artifacts MUST be written in English — pt-BR applies only to UI text visible to end users
- `"use client"` required for: auth guards, forms, and anything reading localStorage
- Auth guard: read `localStorage.getItem('mystery_gifter_token')` on mount; redirect if absent
- Guest guard: if token present → redirect to `/dashboard`
- 401 from backend → clear token → redirect to `/login`
- AdminLTE requires Bootstrap 4 (NOT Bootstrap 5)
- API calls go through the Next.js rewrites proxy (`/api/v1/*` → backend)
- Auto-login after registration = two calls: POST /api/v1/users → POST /api/v1/login

## Stacked Branches Workflow (NON-NEGOTIABLE for all features)

Every task gets its own branch stacked on its dependency. This keeps PRs small (200–400 LOC target) and enables parallel review.

### Branch naming

```
feature/###-description          ← feature base branch (Gitflow)
task/###-T001-description        ← task branch, stacked on base or another task
task/###-T002-description        ← parallel task, also stacked on base
task/###-T010-description        ← stacked on task/###-T005-description
```

### Creating a stack

```bash
# Stack on the feature base
git checkout feature/001-initial-screens
git checkout -b task/001-T001-ts-eslint-prettier

# Stack on another task branch
git checkout task/001-T005-types
git checkout -b task/001-T010-auth-service
```

### After a dependency PR merges into the feature branch

```bash
# Rebase dependent branch onto the updated base
git checkout task/001-T010-auth-service
git rebase --onto feature/001-initial-screens task/001-T005-types
```

### Rules

- Each task branch touches only the files listed in its task .md spec
- Parallel tasks (`[P]` marker in tasks/index.md) MUST NOT share files
- PR title: `feat(T001): description` — Conventional Commits with task scope
- Every PR targets its **parent branch**, not `develop` or `main`
- Merge order follows the dependency graph in `specs/###/tasks/index.md`
- After all task PRs merge into the feature branch, open one PR from `feature/` → `develop`

### Checking stack

```bash
# See commits only in current task branch (vs its parent)
git log --oneline feature/001-initial-screens..HEAD

# See all task branches for a feature
git branch | grep task/001
```

## Recent Changes
- 002-dark-theme-redesign: Added TypeScript 5+, Node.js LTS + Next.js 15.5.4, Bootstrap 4.6, AdminLTE 3.2, Font Awesome Free

- 001-initial-screens: Initial screens MVP — landing, login, register, dashboard

<!-- MANUAL ADDITIONS START -->
- Always answer in Brazilian Portuguese (pt-BR)
<!-- MANUAL ADDITIONS END -->

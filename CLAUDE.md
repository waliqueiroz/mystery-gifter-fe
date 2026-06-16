# mystery-gifter-fe Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-08

## Active Technologies
- TypeScript 5+, Node.js LTS + Next.js 15.5.4, Bootstrap 4.6, AdminLTE 3.2, Font Awesome Free (002-dark-theme-redesign)
- N/A (styling-only feature) (002-dark-theme-redesign)
- TypeScript 5+, Node.js LTS + Next.js 15.5.4 (App Router), React 19, Bootstrap 4.6, AdminLTE 3.2, Jest + React Testing Library + ts-jes (004-groups-profile-features)
- N/A — filter state lives in React component state; user session in `localStorage` via `lib/session.ts` (004-groups-profile-features)

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

## Style Guide (from Constitution v1.2.0)

All new screens and components MUST follow these rules — see constitution for full detail.

- **Theme file**: all style changes go in `src/app/theme.css` only; no hardcoded colors elsewhere
- **Design tokens**: use CSS custom properties — `--mg-primary` (#6B46C1), `--mg-primary-hover`
  (#9F7AEA), `--mg-bg` (#0F0F0F), `--mg-bg-secondary` (#1A202C), `--mg-bg-card` (#2D3748),
  `--mg-text` (#FFF), `--mg-text-muted` (#A0AEC0), `--mg-error` (#FC8181),
  `--mg-transition` (200ms ease-in-out)
- **Dark mode mandatory**: no light mode; `body` background is always `var(--mg-bg)`
- **Custom classes**: project-specific classes MUST be prefixed `mg-` (e.g. `mg-hero`, `mg-feature-card`)
- **No inline styles** for static values — use tokens or Bootstrap/AdminLTE classes
- **Accessibility**: contrast ≥ 4.5:1; `:focus-visible` purple ring on all interactive elements;
  `aria-hidden="true"` on purely decorative elements
- **Gradients**: `to bottom` for backgrounds, `to right` for text gradient effects

## Async Code Style

- **Always use `async/await` with `try/catch/finally`** inside `useEffect` and event handlers — never `.then().catch().finally()` chains
- Pattern for `useEffect` with async: define an inner `async function` and call it immediately

```typescript
useEffect(() => {
  async function load() {
    try {
      const data = await fetchSomething()
      setState(data)
    } catch (err) {
      showToast({ message: err instanceof Error ? err.message : 'Erro.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }
  load()
}, [deps])
```

## Key Rules (from Constitution v1.2.0)

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
- 004-groups-profile-features: Added TypeScript 5+, Node.js LTS + Next.js 15.5.4 (App Router), React 19, Bootstrap 4.6, AdminLTE 3.2, Jest + React Testing Library + ts-jes
- 003-group-management: Added TypeScript 5+, Node.js LTS
- 003-group-management: Added TypeScript 5+, Node.js LTS


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

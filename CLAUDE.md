# mystery-gifter-fe Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-08

## Active Technologies

- **Framework**: Next.js 15.5.4, App Router, React 19, TypeScript 5+
- **UI**: AdminLTE 3.2 (dashboard), Bootstrap 4.6 (public pages), Font Awesome (free)
- **Auth**: JWT in `localStorage` (key: `mystery_gifter_token`); Bearer token for API calls
- **Testing**: Jest + jest-environment-jsdom + React Testing Library + ts-jest
- **Backend API**: `http://localhost:8080/api/v1` (proxied via Next.js rewrites in dev)

## Project Structure

```text
src/
├── app/
│   ├── (public)/            # Landing, login, registro — Bootstrap 4 pages
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
- `"use client"` required for: auth guards, forms, and anything reading localStorage
- Auth guard: read `localStorage.getItem('mystery_gifter_token')` on mount; redirect if absent
- Guest guard: if token present → redirect to `/dashboard`
- 401 from backend → clear token → redirect to `/login`
- AdminLTE requires Bootstrap 4 (NOT Bootstrap 5)
- API calls go through the Next.js rewrites proxy (`/api/v1/*` → backend)
- Auto-login after registration = two calls: POST /api/v1/users → POST /api/v1/login

## Recent Changes

- 001-initial-screens: Initial screens MVP — landing, login, registro, dashboard

<!-- MANUAL ADDITIONS START -->
- Always answer in Brazilian Portuguese (pt-BR)
<!-- MANUAL ADDITIONS END -->

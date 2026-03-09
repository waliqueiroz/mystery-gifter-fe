# Research: Mystery Gifter — Initial Screens

**Feature**: 001-initial-screens
**Date**: 2026-03-08

---

## 1. Backend API Contracts (from swagger.yaml)

### Decision
Use the existing Mystery Gifter API at base path `/api/v1` (host: `localhost:8080` for development).

### Auth — Login

**Endpoint**: `POST /api/v1/login`
**Request body**:
```json
{ "email": "user@example.com", "password": "mypassword123" }
```
**Success response (200)**:
```json
{
  "user": { "id": "...", "name": "João", "surname": "Silva", "email": "...", "created_at": "...", "updated_at": "..." },
  "access_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```
**Error responses**: 400 (invalid credentials), 401 (auth failed), 422 (invalid body)

### Registration — Create User

**Endpoint**: `POST /api/v1/users`
**Request body**:
```json
{
  "name": "João",
  "surname": "Silva",
  "email": "joao@example.com",
  "password": "mypassword123",
  "password_confirm": "mypassword123"
}
```
**Success response (201)**: Returns `UserDTO` — **does NOT return a JWT**.
**Error responses**: 400 (invalid data), 409 (user already exists), 422 (invalid body)

### Critical finding: Auto-login requires two API calls

The registration endpoint returns only `UserDTO`, not `AuthSessionDTO`. To implement
auto-login after registration, the frontend MUST:
1. `POST /api/v1/users` → 201 UserDTO (account created)
2. Immediately `POST /api/v1/login` with the same credentials → 200 AuthSessionDTO
3. Store `access_token` in `localStorage`
4. Redirect to `/dashboard`

This is an implementation detail, not a backend limitation — the flow is fully supported.

---

## 2. UI Framework: AdminLTE 3.2 + Bootstrap 4

### Decision
- Use **AdminLTE 3.2** (free tier) for dashboard layout and components.
- Use **Bootstrap 4** (AdminLTE's dependency) for landing, login, and registration screens.
- Install via npm; import CSS globally; avoid jQuery-dependent JS plugins for MVP screens.

### Rationale
- AdminLTE 3.2 is Bootstrap 4-based (NOT Bootstrap 5); mixing versions would break styles.
- For MVP screens (forms, nav, simple layout), AdminLTE's CSS structure and Bootstrap's
  utility classes are sufficient — no jQuery plugin activation needed.
- Consistency: landing/login/register pages will use Bootstrap 4 classes that match
  AdminLTE's visual language, ensuring a coherent design without extra design work.

### Alternatives considered
- **Bootstrap 5 standalone**: Rejected — AdminLTE 3.2 requires Bootstrap 4; mixing versions
  creates CSS conflicts.
- **Tailwind CSS** (already in constitution as default): Rejected for this feature because
  AdminLTE provides a ready-made admin template that would conflict with Tailwind's reset.
  The constitution allows deviation when justified; this is documented in Complexity Tracking.
- **AdminLTE 4.x** (Bootstrap 5 based): Not yet stable for production at time of this plan.

### Installation notes
```bash
npm install admin-lte@3.2 bootstrap@4.6 @fortawesome/fontawesome-free jquery
```
- CSS imported in `src/app/globals.css` (or root layout)
- jQuery loaded via `next/script` with `strategy="beforeInteractive"` (required for AdminLTE
  JS if any plugin is used; acceptable for MVP)
- For MVP screens that don't use AdminLTE JS plugins, jQuery can be deferred

---

## 3. Authentication Guard Strategy (Next.js App Router + localStorage)

### Decision
Use **client-side auth guards** via wrapper components. No middleware-based protection.

### Rationale
Next.js middleware runs on the Edge (server-side) and cannot access `localStorage`. Since
the JWT is stored in `localStorage` (backend does not support cookies), route protection
must happen client-side:

- **`AuthGuard`** component (for protected routes): reads JWT on mount; if absent →
  `router.push('/login')`. Renders children only after token confirmed.
- **`GuestGuard`** component (for public-only routes: login, register): reads JWT on mount;
  if present → `router.push('/dashboard')`. Prevents re-access to login/register while
  authenticated.

### Trade-off (documented)
Protected pages (`/dashboard`) cannot be Server Components because auth checking requires
`localStorage`. These pages must use `"use client"` or be wrapped in a client guard.
This is a necessary consequence of the backend's JWT-in-payload design and is documented
in the Complexity Tracking table of plan.md.

---

## 4. CORS & API Proxy for Development

### Decision
Configure **Next.js rewrites** in `next.config.ts` to proxy `/api/v1/*` to the backend
`http://localhost:8080/api/v1/*` during development.

### Rationale
Frontend (port 3000) and backend (port 8080) are on different ports. Without a proxy,
every request triggers a CORS preflight. Using Next.js rewrites:
- Avoids creating explicit API route handlers (which the constitution prohibits for simple proxying)
- No CORS configuration changes needed on the backend during development
- In production, the real backend URL is used via environment variable

### Configuration
```ts
// next.config.ts
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
    ]
  },
}
```

---

## 5. Testing Setup

### Decision
Add **Jest** + **React Testing Library** + **jest-environment-jsdom** as dev dependencies.

### Rationale
The project has no testing framework installed. The constitution mandates unit tests for
all components (Principle II). This setup is the standard for Next.js App Router projects.

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest
```

### jest.config.ts
```ts
import type { Config } from 'jest'
const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  coverageThreshold: { global: { lines: 80 } },
}
export default config
```

---

## 6. App Router Route Structure

### Decision

```
src/app/
├── (public)/           # Route group — no shared layout, each page owns its full markup
│   ├── page.tsx        # Landing: /
│   ├── login/
│   │   └── page.tsx    # Login: /login
│   └── registro/
│       └── page.tsx    # Registration: /registro
├── (protected)/        # Route group — AdminLTE layout
│   ├── layout.tsx      # AdminLTE wrapper (sidebar, topbar) — "use client"
│   └── dashboard/
│       └── page.tsx    # Dashboard: /dashboard — "use client" (auth guard)
├── layout.tsx          # Root layout — Bootstrap/AdminLTE CSS imports
└── globals.css
```

Route groups (`(public)` and `(protected)`) are a Next.js App Router feature that allows
different layouts per group without affecting the URL structure.

### Rationale
- Public pages (landing, login, register) need Bootstrap-only layouts, each fully custom.
- Protected pages share AdminLTE's admin layout (sidebar + topbar).
- Route groups cleanly separate these concerns without URL pollution.

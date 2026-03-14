# Quickstart: Mystery Gifter Frontend — Initial Screens

**Feature**: 001-initial-screens
**Date**: 2026-03-08

---

## Prerequisites

- Node.js LTS (v20+)
- npm v10+
- Mystery Gifter API running locally on port 8080 (see `mystery-gifter-api` repo)

---

## 1. Install dependencies

```bash
# Core UI dependencies
npm install admin-lte@3.2 bootstrap@4.6 @fortawesome/fontawesome-free jquery

# Type definitions
npm install --save-dev @types/jquery

# Testing framework
npm install --save-dev jest jest-environment-jsdom ts-jest \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  @types/jest
```

---

## 2. Environment configuration

Create `.env.local` at the project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> **Note**: `NEXT_PUBLIC_` prefix exposes the variable to the browser bundle.

---

## 3. Configure Next.js rewrites (CORS proxy for development)

Update `next.config.ts`:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
```

---

## 4. Configure Jest

Create `jest.config.ts` at the project root:

```typescript
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  coverageThreshold: {
    global: { lines: 80 },
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
}

export default config
```

Create `jest.setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

Create `__mocks__/styleMock.ts`:

```typescript
export default {}
```

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 5. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Validation checklist

- [ ] `http://localhost:3000/` shows the Mystery Gifter landing page
- [ ] Clicking "Entrar" navigates to `/login`
- [ ] Clicking "Criar conta" (on landing) navigates to `/registro`
- [ ] `/login` has a link to `/registro` and vice versa
- [ ] Login with valid credentials redirects to `/dashboard`
- [ ] Login with invalid credentials shows error message
- [ ] Registration with unique e-mail auto-logs in and redirects to `/dashboard`
- [ ] Registration with duplicate e-mail shows "E-mail já em uso" error
- [ ] `/dashboard` shows "O melhor está por vir" and a logout button
- [ ] Logout redirects to `/login` and clears the token
- [ ] Accessing `/dashboard` unauthenticated redirects to `/login`
- [ ] Accessing `/login` while authenticated redirects to `/dashboard`
- [ ] All three screens render correctly on mobile (≤768px)
- [ ] `npm test` runs and all tests pass
- [ ] `npm run build` succeeds with no errors

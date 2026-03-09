# T001 — Project setup (TS + ESLint + Prettier + Jest + UI deps + env + types)

**Story**: Setup
**Branch**: `task/001-T001-project-setup`
**Stack on**: `feature/001-initial-screens`

## Goal

Configure the full project toolchain in a single PR with one commit per concern. Covers TypeScript strict mode, ESLint, Prettier, Jest + React Testing Library, AdminLTE/Bootstrap UI dependencies, environment/proxy config, and shared TypeScript types.

## Commits (in order)

1. `chore(setup): enable TypeScript strict mode and configure ESLint + Prettier`
2. `chore(setup): add Jest + React Testing Library with ts-jest`
3. `chore(setup): install AdminLTE 3.2, Bootstrap 4.6, Font Awesome, jQuery`
4. `chore(setup): add env config and Next.js API proxy rewrites`
5. `chore(setup): define shared TypeScript API and form types`

## Files

### Commit 1 — TypeScript + ESLint + Prettier
- `tsconfig.json` — add `"strict": true`, `"noUncheckedIndexedAccess": true`
- `.prettierrc` — create with: `singleQuote: true`, `semi: false`, `printWidth: 100`
- `.prettierignore` — ignore: `node_modules`, `.next`, `public`
- `package.json` — add scripts: `"type-check": "tsc --noEmit"`, `"format": "prettier --write ."`

### Commit 2 — Jest + RTL
- `package.json` — add dev deps: `jest`, `jest-environment-jsdom`, `ts-jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@types/jest`; add scripts: `"test": "jest"`, `"test:coverage": "jest --coverage"`
- `jest.config.ts` — create with jsdom env, ts-jest transform, `@/` alias, 80% coverage threshold, CSS mock
- `jest.setup.ts` — create with `import '@testing-library/jest-dom'`
- `__mocks__/styleMock.ts` — create with `export default {}`

### Commit 3 — UI dependencies
- `package.json` — add deps: `admin-lte@3.2`, `bootstrap@4.6`, `@fortawesome/fontawesome-free`, `jquery`; add dev dep: `@types/jquery`

### Commit 4 — Env + proxy
- `.env.local` — create with `NEXT_PUBLIC_API_URL=http://localhost:8080`
- `.env.local.example` — create as documentation template (commit this; do NOT commit `.env.local`)
- `.gitignore` — verify `.env.local` is listed (add if missing)
- `next.config.ts` — add `rewrites()` mapping `/api/v1/:path*` → `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`

### Commit 5 — Shared types
- `src/types/api.ts` — define: `AuthSession`, `User`, `ApiError`, `LoginCredentials`, `CreateUserPayload`
- `src/types/forms.ts` — define: `LoginFormData`, `RegisterFormData`

See `specs/001-initial-screens/data-model.md` for exact field definitions.

## Acceptance Criteria

- [ ] `npm run type-check` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run format` runs without errors
- [ ] `tsconfig.json` has `"strict": true`
- [ ] `npm test` runs without errors (no test files yet is OK)
- [ ] `npm run test:coverage` runs without errors
- [ ] `node_modules/admin-lte` exists; `node_modules/bootstrap` is version `4.x`
- [ ] `next.config.ts` exports a `rewrites` function
- [ ] `.env.local` is NOT tracked by git; `.env.local.example` IS tracked
- [ ] `src/types/api.ts` exports all 5 interfaces with no `any`
- [ ] `npm run build` succeeds

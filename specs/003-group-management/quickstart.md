# Quickstart: Secret Santa Group Management

**Branch**: `003-group-management`

## Prerequisites

All required backend changes are in place — no blockers.

| # | Change | Status |
|---|--------|--------|
| BC-001 | `description` optional in `CreateGroupDTO` | ✅ Done |
| BC-002 | `GET /api/v1/groups/{id}/invites/active` endpoint | ✅ Done |
| BC-003 | Membership check on `GET /api/v1/groups/{id}` | ✅ Done |
| BC-004 | Swagger description fix for `ReopenGroup` | ✅ Done |

## Environment setup

```bash
# Start backend + database
cd ../mystery-gifter-api
docker-compose up -d

# Start frontend dev server
cd ../mystery-gifter-fe
npm run dev        # http://localhost:3000
```

## Running tests

```bash
npm test                    # Run all unit tests
npm run test:coverage       # Coverage report (≥80% required for modified components)
npm run lint                # ESLint check
npm run build               # Production build (must pass before PR)
```

## Feature branch setup

```bash
git checkout 003-group-management
# Stacked task branches follow the pattern:
# task/003-T001-description → stacked on 003-group-management
# task/003-T002-description → stacked on 003-group-management (parallel)
# task/003-T010-description → stacked on task/003-T005-description (dependent)
```

## Key files to extend

| File | Change |
|------|--------|
| `src/types/api.ts` | Add group types (see `data-model.md`) |
| `src/types/forms.ts` | Add `CreateGroupFormData` |
| `src/lib/auth.ts` | Extend `clearToken()` to also call `clearUser()` |
| `src/lib/session.ts` | New file: `getUser`, `setUser`, `clearUser` |
| `src/services/api/authService.ts` | Call `setUser()` after login + register |
| `src/app/(protected)/layout.tsx` | Wrap with `ToastProvider` |
| `src/app/theme.css` | Add CSS custom properties + `mg-*` classes for invite card, status badges, toast, flip animation |

## Architecture reminders

- **Every** new component and utility function needs a co-located `*.test.tsx` / `*.test.ts`
- All new `app/` pages and feature components are `"use client"` (reasons documented in `plan.md`)
- Never render `Group.matches` — use `GET /api/v1/groups/{id}/matches/user` for the individual reveal only
- Status mapping: `OPEN` → "Aberto", `MATCHED` → "Sorteio realizado", `ARCHIVED` → "Arquivado"
- All user-visible text in pt-BR; URL path segments in English (`/groups`, `/invite`)
- Invite flow: `InviteSection` calls `GET /api/v1/groups/{id}/invites/active` for all members; owner sees "Gerar link" on 404, non-owner sees placeholder
- Groups list: use `?status=OPEN&status=MATCHED` (multi-value, via `params.append('status', ...)`) — sem filtro client-side

## Task generation

```bash
/speckit.tasks
```

# Tasks Index — Mystery Gifter Initial Screens

**Feature branch**: `feature/001-initial-screens`
**Total tasks**: 13
**Pattern**: Stacked branches — one branch per task, stacked on its dependency

---

## Stack Diagram

```
feature/001-initial-screens  (base)
│
└── task/001-T001-project-setup          Setup (unified)
    │
    ├── task/001-T002-auth-lib           [P] Foundational
    │   ├── task/001-T007-auth-guard     [P] Foundational
    │   └── task/001-T008-guest-guard    [P] Foundational
    │
    ├── task/001-T003-root-layout        [P] Foundational
    │   └── task/001-T009-route-groups   Foundational
    │       ├── task/001-T010-landing-page    [US1] [P]
    │       ├── task/001-T011-registro-page   [US2] [P]
    │       ├── task/001-T012-login-page      [US3] [P]
    │       └── task/001-T013-dashboard-page  [US4] [P]
    │
    ├── task/001-T004-ui-formfield       [P] Foundational
    ├── task/001-T005-ui-button          [P] Foundational
    └── task/001-T006-auth-service       [P] Foundational
```

---

## Tasks by Phase

### Phase 1 — Setup (single branch, 5 commits)

| Task | Description | Branch |
|------|-------------|--------|
| [T001](./T001-project-setup.md) | TS strict + ESLint + Prettier + Jest + UI deps + env + types | `task/001-T001-project-setup` |

> One PR with one commit per concern (see T001 for commit order).

### Phase 2 — Foundational (all parallel after T001)

| Task | Stack on | Description |
|------|----------|-------------|
| [T002](./T002-auth-lib.md) | T001 | Auth helpers (getToken/setToken/clearToken) |
| [T003](./T003-root-layout.md) | T001 | Root layout + Bootstrap/AdminLTE CSS imports |
| [T004](./T004-ui-formfield.md) | T001 | Shared FormField component |
| [T005](./T005-ui-button.md) | T001 | Shared Button component |
| [T006](./T006-auth-service.md) | T001 | Auth service (login + register API calls) |
| [T007](./T007-auth-guard.md) | T002 | AuthGuard (protects dashboard) |
| [T008](./T008-guest-guard.md) | T002 | GuestGuard (redirects auth users from public pages) |
| [T009](./T009-route-groups.md) | T003 | App Router route groups skeleton |

### Phase 3 — User Stories (T010–T013 parallel after T009)

| Task | Story | Stack on |
|------|-------|----------|
| [T010](./T010-landing-page.md) | US1 | T009 |
| [T011](./T011-registro-page.md) | US2 | T009 |
| [T012](./T012-login-page.md) | US3 | T009 |
| [T013](./T013-dashboard-page.md) | US4 | T009 |

---

## Stacked Branch Quick Reference

```bash
# T001 stacks on the feature base
git checkout feature/001-initial-screens
git checkout -b task/001-T001-project-setup

# Foundational tasks stack on T001 (run in parallel)
git checkout task/001-T001-project-setup
git checkout -b task/001-T002-auth-lib
git checkout task/001-T001-project-setup
git checkout -b task/001-T003-root-layout
# ... repeat for T004, T005, T006

# T007 and T008 stack on T002
git checkout task/001-T002-auth-lib
git checkout -b task/001-T007-auth-guard

# T009 stacks on T003
git checkout task/001-T003-root-layout
git checkout -b task/001-T009-route-groups

# After a base branch merges into feature/001-initial-screens,
# rebase dependent branch onto the updated base:
git checkout task/001-T009-route-groups
git rebase --onto feature/001-initial-screens task/001-T003-root-layout

# Check commits in current task branch only
git log --oneline feature/001-initial-screens..HEAD
```

---

## Independent Test per User Story

| Story | How to test independently |
|-------|-----------------------------|
| US1 — Landing | Navigate `/` without session → landing renders with both CTAs |
| US2 — Register | Submit valid form → redirected to `/dashboard` without manual login |
| US3 — Login | Submit valid credentials → redirected to `/dashboard` |
| US4 — Dashboard | Access `/dashboard` with token → sees "O melhor está por vir" + logout works |

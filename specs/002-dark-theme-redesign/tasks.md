# Tasks: Visual Redesign — Dark Purple Theme

**Input**: Design documents from `/specs/002-dark-theme-redesign/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: Unit tests for modified React components are MANDATORY per Constitution Principle II.
CSS-only tasks do not require test tasks — tests are only required when component markup changes.

**Organization**: Tasks are grouped by user story. Each phase is independently deployable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (touches different files from sibling [P] tasks)
- **[Story]**: Which user story this task belongs to (US1–US4)

---

## Phase 1: Setup

**Purpose**: Create the theme file and wire it into the CSS pipeline. Unblocks all user story phases.

- [ ] T001 Create `src/app/theme.css` with `:root` CSS design tokens only (`--mg-primary`, `--mg-primary-hover`, `--mg-bg`, `--mg-bg-secondary`, `--mg-bg-card`, `--mg-text`, `--mg-text-muted`, `--mg-error`, `--mg-transition`) — no override rules yet
- [ ] T002 Update `src/app/globals.css` to append `@import './theme.css';` after the AdminLTE import line

> **Checkpoint**: `theme.css` exists and is loaded. CSS variables are available globally. No visual change yet.

---

## Phase 2: User Story 1 — Consistent Design System (Priority: P1) 🎯 MVP

**Goal**: Apply the dark purple palette globally so every Bootstrap and AdminLTE element inherits the new theme automatically — without touching any component file.

**Independent Test**: Open landing, login, register, and dashboard pages. All should show a dark background, white text, and purple-accented interactive elements — with zero component code changes.

**Note**: No component markup changes in this phase. All tasks append CSS rules to `src/app/theme.css`.

- [ ] T003 [US1] Add global base overrides to `src/app/theme.css`: `body` (background-color, color) and `label` (color using `--mg-text-muted`)
- [ ] T004 [US1] Add button overrides to `src/app/theme.css`: `.btn-primary` (bg, border, transition) and `.btn-primary:hover/:focus` + `.btn-outline-primary` and `.btn-outline-primary:hover`
- [ ] T005 [US1] Add form control overrides to `src/app/theme.css`: `.form-control` (bg, border, color), `::placeholder`, `:focus` (purple ring), `.form-control.is-invalid` (soft red border), `.invalid-feedback` (soft red text)
- [ ] T006 [US1] Add card and alert overrides to `src/app/theme.css`: `.card` (bg, purple border, shadow), `.card-body` (text color), `.alert-danger` (dark red tint bg, soft red border and text)

> **Checkpoint (US1 complete)**: Login and register pages fully reflect the dark theme via CSS cascade. No component files were changed. Run `npm test` — all existing tests must still pass.

---

## Phase 3: User Story 2 — Immersive Landing Page (Priority: P2)

**Goal**: Add parallax background and gradient title to the landing page hero section.

**Independent Test**: Access the public root route (`/`). Scrolling on desktop triggers a parallax background effect. On mobile (≤ 768px) the background is a static gradient. The main title renders with a left-to-right purple gradient.

- [ ] T007 [US2] Add hero CSS to `src/app/theme.css`: `.mg-hero` (vertical gradient, `background-attachment: fixed`, `min-height: 100vh`) with `@media (max-width: 768px)` and `@media (prefers-reduced-motion: reduce)` overriding to `background-attachment: scroll`; `.mg-hero-title` (gradient text via `background-clip: text`)
- [ ] T008 [P] [US2] Update `src/components/landing/HeroSection.tsx`: replace outer wrapper class `container d-flex flex-column align-items-center justify-content-center min-vh-100` with `mg-hero d-flex flex-column align-items-center justify-content-center`; add `mg-hero-title` to the `<h1>` element
- [ ] T009 [P] [US2] Update `src/components/landing/HeroSection.test.tsx`: update CSS class assertions to match the new `mg-hero` wrapper and `mg-hero-title` heading classes

> **Note**: T008 and T009 touch different files and can be implemented in parallel. Both depend on T007.

> **Checkpoint (US2 complete)**: Landing page hero is visually distinct with gradient and parallax. All `HeroSection` tests pass.

---

## Phase 4: User Story 3 — Authentication Forms with Dark Theme (Priority: P3)

**Goal**: Login and register pages display dark cards, styled form fields, purple focus rings, and soft-red error states.

**Independent Test**: Access `/login` and `/register`. The card has a purple border with dark background. Focusing a field shows a purple glow. A validation error displays soft-red `#FC8181` feedback.

**No implementation tasks required**: All styling for this user story is already delivered by Phase 2 (T003–T006). The CSS cascade automatically themes `.card`, `.form-control`, `.is-invalid`, and `.invalid-feedback` components used in `LoginForm` and `RegisterForm`.

> **Checkpoint (US3 complete)**: Visually inspect `/login` and `/register`. Run `npm test` — `LoginForm.test.tsx` and `RegisterForm.test.tsx` must pass unchanged.

---

## Phase 5: User Story 4 — Dashboard with Dark AdminLTE Theme (Priority: P4)

**Goal**: The dashboard navbar turns dark purple with white text; the content area uses a very dark gray background.

**Independent Test**: Log in and access `/dashboard`. The navbar is dark purple with white links and logout button. The content background is `#1A202C`. Hovering navbar links shows a light purple accent.

- [ ] T010 [US4] Add AdminLTE overrides to `src/app/theme.css`: `.main-header.navbar` (purple bg), `.main-header .nav-link`, `.main-header .navbar-brand`, `.main-header .btn-link` (white text, hover purple), `.content-wrapper` (dark secondary bg)
- [ ] T011 [P] [US4] Update `src/app/(protected)/layout.tsx`: replace `navbar-white navbar-light` with `navbar-dark` in the `<nav>` className
- [ ] T012 [P] [US4] Update `src/app/(protected)/AdminLTELayout.test.tsx`: update navbar class assertions to expect `navbar-dark` instead of `navbar-white` and `navbar-light`

> **Note**: T011 and T012 touch different files and can be implemented in parallel. Both depend on T010.

> **Checkpoint (US4 complete)**: Dashboard matches the dark purple identity. All `AdminLTELayout` tests pass.

---

## Phase 6: Polish & Validation

**Purpose**: Final cross-cutting quality gate before the feature branch is merged.

- [ ] T013 Run full test suite `npm test` and confirm zero failures across all modified components
- [ ] T014 [P] Run production build `npm run build` and confirm it succeeds with no errors
- [ ] T015 [P] Accessibility spot-check: use browser devtools to verify contrast ratios ≥ 4.5:1 on body text, card text, button text, and error messages (per SC-002)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (T001–T002)       → No dependencies. Start immediately.
Phase 2 (T003–T006)       → Depends on Phase 1 (T002). Sequential within phase (same file).
Phase 3 (T007–T009)       → Depends on Phase 2 (T006).
Phase 4 (no tasks)        → Implicitly complete after Phase 2.
Phase 5 (T010–T012)       → Depends on Phase 3 (T007). T010 extends theme.css; T011+T012 are parallel.
Phase 6 (T013–T015)       → Depends on all prior phases.
```

### File Change Map

| File | Tasks | Phase |
|------|-------|-------|
| `src/app/theme.css` (create) | T001 | 1 |
| `src/app/globals.css` | T002 | 1 |
| `src/app/theme.css` (extend) | T003, T004, T005, T006, T007, T010 | 2, 3, 5 |
| `src/components/landing/HeroSection.tsx` | T008 | 3 |
| `src/components/landing/HeroSection.test.tsx` | T009 | 3 |
| `src/app/(protected)/layout.tsx` | T011 | 5 |
| `src/app/(protected)/AdminLTELayout.test.tsx` | T012 | 5 |

### Parallel Opportunities

- **T008 + T009** (Phase 3): Component and test files are independent — can be opened as parallel PRs or committed together.
- **T011 + T012** (Phase 5): Same pattern — component and test are independent files.
- **T014 + T015** (Phase 6): Independent validation tasks.
- **T001 and T002** (Phase 1): Different files — can be opened as parallel PRs (T002 import is a no-op until T001 creates the file, so merge T001 first).

---

## Implementation Strategy

### MVP (User Story 1 only)

1. Complete Phase 1 (T001–T002)
2. Complete Phase 2 (T003–T006)
3. **Stop and validate**: All pages have dark background, purple buttons, themed form fields and cards
4. Ship as a releasable increment

### Incremental Delivery

1. Phase 1 + 2 → Dark global theme (**MVP**)
2. + Phase 3 → Immersive landing with parallax
3. + Phase 5 → Dark dashboard
4. + Phase 6 → Quality gate

### Suggested Branch Stack

```
feature/002-dark-theme-redesign
└── task/002-T001-theme-css-tokens
    └── task/002-T002-import-theme-css
        └── task/002-T003-base-overrides
            └── task/002-T004-button-overrides
                └── task/002-T005-form-overrides
                    └── task/002-T006-card-alert-overrides
                        └── task/002-T007-hero-css
                            ├── task/002-T008-herosection-component  [P]
                            └── task/002-T009-herosection-test        [P]
                                └── task/002-T010-adminlte-css
                                    ├── task/002-T011-layout-navbar    [P]
                                    └── task/002-T012-layout-test      [P]
```

---

## Notes

- All `theme.css` extension tasks (T003–T007, T010) modify the same file — they must be stacked sequentially
- Tasks marked [P] touch exclusively different files — safe to implement in parallel
- Constitution Principle II: T009 and T012 (test updates) MUST be committed in the same PR as their corresponding component tasks (T008, T011)
- No new npm packages are introduced — all styling uses CSS cascade over Bootstrap 4.6 + AdminLTE 3.2

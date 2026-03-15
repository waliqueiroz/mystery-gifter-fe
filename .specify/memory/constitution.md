<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.2 → 1.2.0
Modified principles:
  - Principle III (UX Consistency): added reference to mandatory Style Guide section
Modified sections:
  - Frontend Standards: added reference to theme.css and Style Guide
Added sections:
  - Style Guide (new section): design tokens, color palette, typography, component overrides,
    accessibility rules, and extension pattern — derived from feature/002-dark-theme-redesign
Removed sections: N/A
Templates updated:
  ✅ .specify/memory/constitution.md (this file)
  ✅ plan-template.md — Constitution Check gate already generic; no change needed
  ✅ tasks-template.md — already references Principle II; no change needed
Follow-up TODOs:
  - Update .specify/scripts/bash/create-new-feature.sh to prepend `feature/` prefix to generated
    branch names, or support a --type flag (feature|fix|hotfix|release).
  - Long-term: update .specify/scripts/bash/common.sh check_feature_branch() to recognize Gitflow
    prefixes (feature/, fix/, hotfix/) natively, eliminating the need for SPECIFY_FEATURE.
-->

# Mystery Gifter Frontend Constitution

## Core Principles

### I. Code Quality

All code in this project MUST be clean, readable, and maintainable.
Specifically:

- Every file and module MUST have a single, clear responsibility (Single Responsibility Principle).
- Functions and components MUST be small and focused — prefer composing small pieces over large,
  multi-purpose implementations.
- Magic numbers and inline strings MUST be extracted into named constants.
- Dead code, unused imports, and commented-out blocks MUST NOT be committed.
- TypeScript MUST be used throughout; `any` types are forbidden unless explicitly justified with
  an inline comment.
- Linting and formatting rules (ESLint + Prettier) MUST pass on every commit — no exceptions.

**Rationale**: Consistent, high-quality code reduces onboarding friction, prevents subtle bugs,
and ensures the codebase remains maintainable as the team and feature set grow.

### II. Unit Testing (NON-NEGOTIABLE)

Every React component and every utility function in this project MUST have a corresponding
unit test. This is a non-negotiable constraint that applies to all new and modified code.

- Tests MUST be co-located with source files in the same directory
  (e.g., `Button.tsx` + `Button.test.tsx`); `__tests__` subdirectories MUST NOT be used.
- Tests MUST use React Testing Library and Jest (or Vitest if configured).
- Each component test MUST cover: render without crashing, primary interactive behavior,
  and any conditional rendering branches.
- Tests MUST be written before or alongside implementation (test-first preferred, test-alongside
  acceptable; test-after is NOT acceptable).
- A PR MUST NOT be merged if test coverage for modified components drops below the project
  threshold (minimum 80% line coverage).
- Tests MUST NOT use implementation details (no direct access to internal state or refs);
  test behavior from the user's perspective.

**Rationale**: Unit tests are the primary safety net for refactoring and new feature development.
Mandating them for every component prevents untested regressions and documents expected behavior.

### III. User Experience Consistency

The UI MUST present a coherent, predictable experience across all screens and states.

- The Style Guide defined in this constitution (see **Style Guide** section) MUST be followed
  on all new screens and components — no ad-hoc colors, spacing, or component variants that
  contradict the established design tokens.
- Bootstrap 4 variables and AdminLTE 3.2 theme variables MUST be used as the base design
  system; overrides MUST be applied exclusively through `src/app/theme.css` using the defined
  CSS custom properties.
- Loading, error, and empty states MUST be handled explicitly in every data-dependent component;
  "undefined behavior" on network failure is not acceptable.
- Interactive elements (buttons, links, forms) MUST follow consistent feedback patterns:
  disabled state during submission, visible error messages on failure, success confirmation.
- Accessibility (a11y) MUST be considered: all interactive elements MUST be keyboard-navigable
  and have appropriate ARIA labels where native semantics are insufficient.
- Responsive breakpoints MUST be respected on all new screens — no component may be
  desktop-only unless explicitly scoped.

**Rationale**: A consistent UX builds user trust and reduces support burden. Enforcing this at
the constitution level prevents individual components from drifting from the established patterns.

### IV. Performance Standards

The application MUST meet the following performance targets, measured against Lighthouse or
Core Web Vitals in CI:

- **LCP (Largest Contentful Paint)**: ≤ 2.5 s on desktop, ≤ 4.0 s on mobile (3G simulated).
- **CLS (Cumulative Layout Shift)**: ≤ 0.1 across all pages.
- **INP (Interaction to Next Paint)**: ≤ 200 ms for primary interactions.
- Images MUST use Next.js `<Image>` with explicit `width`, `height`, and appropriate `priority`
  flags — raw `<img>` tags are forbidden.
- JavaScript bundles MUST be code-split by route; no feature's code MUST be bundled into the
  initial payload unless it is required for the initial render.
- Third-party scripts MUST be loaded with `next/script` using an appropriate `strategy`
  (`lazyOnload` by default).

**Rationale**: Frontend performance directly impacts user retention and SEO. Explicit, measurable
targets prevent performance regressions from going unnoticed during feature development.

### V. Next.js Best Practices & Simplicity

This project MUST follow the official Next.js App Router conventions and community-established
patterns. Complexity MUST be justified — the simplest solution that meets requirements is
always preferred (YAGNI).

- Use the App Router (`app/`) directory for all routing; the Pages Router MUST NOT be used.
- Route segments (directory names under `app/`) MUST be in English — e.g., `/register`, not
  `/registro`. UI text and labels remain in pt-BR; only the URL path is English.
- Server Components MUST be the default; add `"use client"` only when interactivity,
  browser APIs, or hooks require it — and document why at the top of the file.
- Data fetching MUST use Server Components + `fetch` with appropriate caching options,
  or Server Actions for mutations; client-side `useEffect` for data fetching is forbidden
  unless no server-side alternative exists.
- Route handlers (`app/api/`) MUST be used only for endpoints that genuinely require server
  logic; avoid creating API routes that simply proxy an existing backend.
- Global state MUST be minimized; prefer URL state, server state (React Query / SWR), or
  React context scoped to a subtree over a global store.
- Dependencies MUST be evaluated for bundle size impact before adoption; prefer native
  browser/Next.js capabilities over third-party libraries for standard tasks.

**Rationale**: Following the framework's intended patterns ensures compatibility with future
Next.js versions, benefits from built-in optimizations, and keeps the codebase approachable
for developers already familiar with the Next.js ecosystem.

## Frontend Standards

**Language & Runtime**: TypeScript 5+, Node.js LTS
**Framework**: Next.js 14+ (App Router)
**Styling**: Bootstrap 4.6 + AdminLTE 3.2, extended by `src/app/theme.css` (see Style Guide).
  Tailwind CSS MUST NOT be used — it conflicts with Bootstrap 4's reset and AdminLTE's CSS.
  No inline `style` props except for dynamic values that cannot be expressed as class names.
**Theme file**: All style customizations MUST live in `src/app/theme.css`, imported last in
  `src/app/globals.css` so it cascades over framework defaults. Hardcoded color or spacing
  values outside this file are forbidden.
**Component library**: Shared component library under `src/components/ui/`; all reusable
  primitives MUST live there and MUST have unit tests.
**Testing stack**: Jest + React Testing Library (unit); Playwright or Cypress (E2E, optional
  per feature).
**Linting & formatting**: ESLint (next/core-web-vitals ruleset) + Prettier — enforced via
  pre-commit hook and CI.
**CI gate**: All tests MUST pass, linting MUST be clean, and build MUST succeed before any
  PR is merged.

## Style Guide

This section defines the mandatory visual identity for Mystery Gifter. Every new screen,
component, or feature MUST conform to these rules. Deviations require explicit justification
in the feature's `plan.md` Complexity Tracking table.

### Dark Theme (NON-NEGOTIABLE)

- The application MUST operate in **mandatory dark mode** at all times.
- There is no light mode alternative — `prefers-color-scheme: light` is intentionally ignored.
- The `body` background MUST always resolve to `var(--mg-bg)` (`#0F0F0F`).

### Design Tokens

All visual values MUST be referenced via the CSS custom properties defined in `:root` inside
`src/app/theme.css`. Adding a hardcoded hex, rgb, or hsl value anywhere outside that file
is a constitution violation.

| Token | Value | Usage |
|-------|-------|-------|
| `--mg-primary` | `#6B46C1` | Buttons, borders, active states |
| `--mg-primary-hover` | `#9F7AEA` | Hover/focus states, accents |
| `--mg-bg` | `#0F0F0F` | Page background (body) |
| `--mg-bg-secondary` | `#1A202C` | Dashboard content, input backgrounds |
| `--mg-bg-card` | `#2D3748` | Card backgrounds |
| `--mg-text` | `#FFFFFF` | Primary text on dark backgrounds |
| `--mg-text-muted` | `#A0AEC0` | Labels, placeholders, secondary text |
| `--mg-error` | `#FC8181` | Validation errors, danger alerts |
| `--mg-transition` | `200ms ease-in-out` | All hover/focus transitions |

### Color Palette

- **Primary purple** (`--mg-primary`, `#6B46C1`): action buttons, highlights, card borders.
- **Accent purple** (`--mg-primary-hover`, `#9F7AEA`): hover states, focus rings, gradient ends.
- **Background** (`--mg-bg`, `#0F0F0F`): default page background.
- **Surface dark** (`--mg-bg-secondary`, `#1A202C`): inputs, dashboard content area.
- **Surface card** (`--mg-bg-card`, `#2D3748`): card components.
- **Text primary** (`--mg-text`, `#FFFFFF`): body and heading text.
- **Text muted** (`--mg-text-muted`, `#A0AEC0`): labels, captions, placeholders.
- **Error/danger** (`--mg-error`, `#FC8181`): soft red — invalid fields, `.alert-danger`.
- **Gradients**: use `linear-gradient` between `--mg-primary` and `--mg-primary-hover` only.
  Direction MUST be `to bottom` for backgrounds and `to right` for text gradient effects.

### Typography

- Use the default sans-serif font stack provided by Bootstrap 4.6 / AdminLTE 3.2.
  No custom web fonts may be added unless approved in a spec and measured against LCP budget.
- Font Awesome Free is the approved icon library; new icon libraries MUST NOT be introduced.
- Heading text on dark backgrounds MUST use `--mg-text` (`#FFFFFF`).
- Body and secondary text MUST use `--mg-text` or `--mg-text-muted` (`#A0AEC0`).
- Minimum contrast ratio: **4.5:1** (WCAG AA) for all text/background combinations.

### Component Overrides

All Bootstrap and AdminLTE component overrides MUST be placed in `src/app/theme.css`.
The following rules are already established and MUST NOT be duplicated or contradicted:

**Buttons**
- `.btn-primary`: background `--mg-primary`, border `--mg-primary`, text white.
  Hover/focus: background and border transition to `--mg-primary-hover`.
- `.btn-outline-primary`: border `--mg-primary`, text `--mg-primary-hover`.
  Hover/focus: background `--mg-primary`, text white.
- Inside `.mg-hero`: `.btn-outline-primary` MUST use white text and semi-transparent
  white border (`rgba(255,255,255,0.7)`) to maintain contrast on the gradient background.

**Form Controls**
- `.form-control`: background `--mg-bg-secondary`, border `#4A5568`, text `--mg-text`.
- `::placeholder`: color `--mg-text-muted`.
- `:focus`: border `--mg-primary-hover`, box-shadow `0 0 0 0.2rem rgba(159,122,234,0.25)`.
- `.form-control.is-invalid`: border `--mg-error`.
- `.invalid-feedback`: color `--mg-error`.

**Cards**
- `.card`: background `--mg-bg-card`, border `1px solid --mg-primary`,
  box-shadow `0 8px 32px rgba(107,70,193,0.3)`.
- `.card-body`: color `--mg-text`.

**Alerts**
- `.alert-danger`: background `rgba(252,129,129,0.1)`, border `--mg-error`, text `--mg-error`.
  Other alert variants (success, warning, info) inherit Bootstrap defaults unless overridden
  in a future feature spec.

**AdminLTE Navbar & Content**
- `.main-header.navbar`: background `--mg-primary` (`!important`).
- `.main-header .nav-link`, `.main-header .navbar-brand`, `.main-header .btn-link`:
  color `--mg-text` (`!important`), hover color `--mg-primary-hover`.
- `.content-wrapper`: background `--mg-bg-secondary` (`!important`).
- The `<nav>` in the protected layout MUST use the `navbar-dark` Bootstrap modifier class
  (not `navbar-white navbar-light`).

### Landing Page Hero

The landing page hero uses dedicated utility classes that MUST be applied as defined:

- `.mg-hero`: full-viewport section (`min-height: 100vh`, `position: relative`,
  `overflow: hidden`) with a vertical purple gradient background.
- `.mg-hero-title`: gradient text (`linear-gradient to right`, white → `--mg-primary-hover`)
  using `background-clip: text`.
- `.mg-hero-icon`: floating icon above the heading — `display: inline-block`, animated
  with `mg-float` keyframe.
- `.mg-feature-card`: glassmorphism card (`rgba(255,255,255,0.1)` bg, white border,
  `0.75rem` border-radius) used for feature highlights below the CTAs.
- Future landing page sections MUST reuse these tokens and follow the same gradient language.

### Accessibility Rules

- **Focus rings**: ALL interactive elements MUST display a visible purple focus ring via
  `:focus-visible { outline: 2px solid var(--mg-primary-hover); outline-offset: 2px; }`.
  This rule is global and MUST NOT be overridden to `none` without providing an alternative.
- **Reduced motion**: the global rule `@media (prefers-reduced-motion: reduce)` suppresses
  ALL CSS transitions and animations. New animations MUST NOT add their own reduced-motion
  overrides — the global blanket rule already covers them.
- **Contrast**: every text/background combination MUST meet a minimum ratio of 4.5:1.
  Use the browser DevTools accessibility panel or axe to verify before merging.
- **Decorative elements**: purely decorative elements (icons, orbs, shapes) MUST carry
  `aria-hidden="true"` so they are invisible to screen readers.

### Extension Pattern

When a new feature requires new visual elements:

1. **Add tokens first**: if a new color, spacing, or transition value is needed, add it as
   a CSS custom property to `:root` in `src/app/theme.css` before using it anywhere.
2. **Override, never duplicate**: extend Bootstrap/AdminLTE components via additional CSS rules
   in `theme.css` — never copy/paste their HTML structure to create a look-alike from scratch.
3. **Namespace custom classes**: all project-specific utility classes MUST be prefixed with
   `mg-` (e.g., `.mg-hero`, `.mg-feature-card`) to avoid collisions with Bootstrap utilities.
4. **No inline styles for static values**: `style` props on JSX elements MUST NOT be used
   for values that can be expressed as a CSS class or design token.
5. **Spec the change**: visual changes affecting more than one component MUST be documented
   in the feature spec (FR section) and reflected in `theme.css` as a single, reviewable diff.

## Development Workflow

1. **Branch naming — Gitflow (NON-NEGOTIABLE)**: All branches MUST follow the Gitflow
   naming convention. Branches NOT conforming to this pattern MUST NOT be merged.

   | Branch type | Pattern | Purpose |
   |-------------|---------|---------|
   | Feature | `feature/###-short-description` | New functionality (e.g., `feature/001-gift-selection`) |
   | Bug fix | `fix/###-short-description` | Non-critical defect corrections (e.g., `fix/002-login-redirect`) |
   | Hotfix | `hotfix/###-short-description` | Critical production fixes (e.g., `hotfix/003-auth-crash`) |
   | Release | `release/x.y.z` | Release preparation (e.g., `release/1.0.0`) |
   | Integration | `develop` | Ongoing integration target; all feature/fix branches merge here |
   | Production | `main` | Stable production branch; only release and hotfix branches merge here |

2. **Spec before code**: a spec.md MUST exist before implementation begins for any
   non-trivial feature.

3. **Tests alongside implementation**: unit tests MUST be committed in the same PR as the
   component implementation — not as a follow-up.

4. **PR checklist**: before requesting review, the author MUST verify:
   - All unit tests pass locally (`npm test`).
   - Lint and type-check pass (`npm run lint && npm run type-check`).
   - Build succeeds (`npm run build`).
   - No console errors or warnings introduced.
   - Accessibility spot-check performed (keyboard navigation, color contrast ≥ 4.5:1).
   - New visual elements follow the Style Guide (design tokens, `mg-` prefix, no inline styles).

5. **Review requirements**: at least one approval required before merge; reviewer MUST
   verify constitution compliance, not just functional correctness.

6. **Commit message format — Conventional Commits (NON-NEGOTIABLE)**: Every commit MUST
   follow the Conventional Commits specification (`type(scope): description`). Commits
   not conforming to this format MUST be rejected by the pre-commit hook or CI.

   Allowed types:

   | Type | When to use |
   |------|-------------|
   | `feat` | A new feature or user-visible behavior |
   | `fix` | A bug fix |
   | `test` | Adding or correcting tests |
   | `refactor` | Code change with no functional effect |
   | `style` | Formatting, whitespace, missing semicolons (no logic change) |
   | `chore` | Tooling, config, dependency updates |
   | `docs` | Documentation only |
   | `perf` | Performance improvements |
   | `ci` | CI/CD pipeline changes |
   | `build` | Build system or external dependency changes |
   | `revert` | Reverts a previous commit |

   Breaking changes MUST append `!` after the type (e.g., `feat!: redesign auth flow`) and
   include a `BREAKING CHANGE:` footer explaining the impact.

7. **Speckit compatibility — `SPECIFY_FEATURE` (NON-NEGOTIABLE while scripts are not updated)**:
   The speckit scripts (`common.sh`) locate the active spec by matching the git branch name
   against the `###-short-description` pattern. Because this project uses Gitflow branch names
   (e.g., `feature/001-initial-screens`), the scripts cannot resolve the spec directory
   automatically.

   **Before running any speckit command** (`/speckit.plan`, `/speckit.clarify`, `/speckit.tasks`,
   etc.) on a Gitflow branch, the `SPECIFY_FEATURE` environment variable MUST be set to the
   spec directory name — i.e., the `###-short-description` part **without** the Gitflow prefix:

   ```bash
   # Example: working on feature/001-initial-screens
   export SPECIFY_FEATURE=001-initial-screens
   ```

   Derivation rule: strip the Gitflow prefix (`feature/`, `fix/`, `hotfix/`) from the branch
   name to obtain the value. For `release/x.y.z` branches, speckit commands are not typically
   used, so no value is needed.

   This requirement is a temporary compatibility shim until
   `.specify/scripts/bash/common.sh` is updated to natively recognize Gitflow prefixes.

## Governance

This constitution supersedes all other development practices, coding guidelines, and informal
conventions in the mystery-gifter-fe project.

**Amendment procedure**:
1. Propose the amendment in a PR that modifies this file.
2. The PR description MUST explain the motivation, the version bump rationale, and list all
   affected templates and docs.
3. Amendment requires at least one approval from a project maintainer.
4. On merge, `LAST_AMENDED_DATE` MUST be updated to the merge date and `CONSTITUTION_VERSION`
   MUST be incremented per semantic versioning rules documented in the version line.

**Versioning policy**:
- MAJOR: removal or backward-incompatible redefinition of an existing principle.
- MINOR: new principle or section added; material expansion of existing guidance.
- PATCH: clarification, wording improvement, or typo fix with no semantic change.

**Compliance review**: every PR review MUST include a constitution check. Violations require
explicit justification documented in the Complexity Tracking table of the relevant plan.md
before they may be merged.

**Version**: 1.2.0 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-03-15

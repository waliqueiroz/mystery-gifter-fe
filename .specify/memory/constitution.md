<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.1 → 1.1.2
Modified principles: N/A
Modified sections:
  - Frontend Standards: Tailwind CSS replaced with Bootstrap 4.6 + AdminLTE 3.2
  - Principle III: design token reference updated to Bootstrap 4 + AdminLTE variables
Added sections: N/A
Removed sections: N/A
Templates updated:
  ✅ .specify/memory/constitution.md (this file)
  ⚠ .specify/templates/tasks-template.md — branch naming examples still use ###-short-description;
      update to feature/###-short-description when the speckit scripts are updated.
  ⚠ .specify/scripts/bash/create-new-feature.sh — branch prefix (feature/) not yet added by the
      script; manual adjustment required when creating branches until script is patched.
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

- Bootstrap 4 variables and AdminLTE 3.2 theme variables MUST be used as the design token
  system (colors, spacing, typography) — no ad-hoc inline styles that duplicate or
  contradict these variables.
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
**Styling**: Bootstrap 4.6 + AdminLTE 3.2 — Bootstrap 4 for public pages (landing, login,
  registro); AdminLTE 3.2 for authenticated pages (dashboard and beyond). Tailwind CSS MUST
  NOT be used — it conflicts with Bootstrap 4's reset and AdminLTE's CSS. No inline `style`
  props except for dynamic values that cannot be expressed as Bootstrap/AdminLTE class names.
**Component library**: Shared component library under `src/components/ui/`; all reusable
  primitives MUST live there and MUST have unit tests.
**Testing stack**: Jest + React Testing Library (unit); Playwright or Cypress (E2E, optional
  per feature).
**Linting & formatting**: ESLint (next/core-web-vitals ruleset) + Prettier — enforced via
  pre-commit hook and CI.
**CI gate**: All tests MUST pass, linting MUST be clean, and build MUST succeed before any
  PR is merged.

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
   - Accessibility spot-check performed (keyboard navigation, color contrast).

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

**Version**: 1.1.2 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-03-08

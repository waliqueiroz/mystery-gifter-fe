# Implementation Plan: Visual Redesign — Dark Purple Theme

**Branch**: `002-dark-theme-redesign` | **Date**: 2026-03-14 | **Spec**: [spec.md](./spec.md)

## Summary

Apply a mandatory dark purple visual theme to all existing screens (landing, login, register, dashboard) by:

1. Creating a single `src/app/theme.css` with CSS custom properties (design tokens) and Bootstrap/AdminLTE override rules — imported last in `globals.css` so it cascades over framework defaults.
2. Applying new utility classes (`mg-hero`, `mg-hero-title`) to `HeroSection` for the parallax background and gradient text on the landing page.
3. Changing the protected layout navbar from `navbar-white navbar-light` to `navbar-dark` for correct text contrast on the dark purple background.
4. Adding a global `prefers-reduced-motion` rule that suppresses all CSS transitions (FR-016).
5. Adding a `:focus-visible` rule for keyboard navigation focus rings on all interactive elements (FR-017).

No new npm packages are required. All changes are compatible with Bootstrap 4.6 + AdminLTE 3.2. All other components (Button, FormField, LoginForm, RegisterForm, DashboardContent) are automatically themed by CSS cascade — no code changes needed in those files.

## Technical Context

**Language/Version**: TypeScript 5+, Node.js LTS
**Primary Dependencies**: Next.js 15.5.4, Bootstrap 4.6, AdminLTE 3.2, Font Awesome Free
**Storage**: N/A (styling-only feature)
**Testing**: Jest + React Testing Library + ts-jest
**Target Platform**: Web browser — desktop + mobile-first (Bootstrap 4 responsive grid)
**Project Type**: Web application (Next.js 15 App Router)
**Performance Goals**: LCP ≤ 2.5s desktop / 4.0s mobile; CLS ≤ 0.1; INP ≤ 200ms; parallax ≥ 60fps on desktop
**Constraints**: No Tailwind; no Bootstrap 5; no new npm packages for styling; no inline `style` props for static values
**Scale/Scope**: 4 screens affected; 1 new CSS file; 2 component markup updates; 2 test file updates

## Constitution Check

| Gate | Status | Notes |
|------|--------|-------|
| I — Code Quality | ✅ Pass | CSS custom properties as design tokens; no magic numbers; `theme.css` has single responsibility |
| II — Unit Tests | ✅ Pass | Modified components (HeroSection, ProtectedLayout) include test updates in the same PR |
| III — UX Consistency | ✅ Pass | Feature enforces cross-page consistency; focus (FR-017), error, and hover states all defined |
| IV — Performance | ✅ Pass | Parallax is CSS-only; disabled on ≤ 768px and `prefers-reduced-motion`; no new JS weight |
| V — Next.js Best Practices | ✅ Pass | No new dependencies; static values in CSS file, not inline styles |

## Project Structure

### Documentation (this feature)

```text
specs/002-dark-theme-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions and rationale
├── quickstart.md        # Theme system guide for future developers
└── tasks.md             # Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css                          # MODIFY: add @import './theme.css'
│   ├── theme.css                            # CREATE: design tokens + all CSS overrides
│   └── (protected)/
│       └── layout.tsx                       # MODIFY: navbar-white navbar-light → navbar-dark
└── components/
    └── landing/
        ├── HeroSection.tsx                  # MODIFY: add mg-hero + mg-hero-title classes
        └── HeroSection.test.tsx             # MODIFY: update CSS class assertions
```

> **No changes needed** in: `Button.tsx`, `FormField.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`, `DashboardContent.tsx`, `AuthGuard.tsx`, `GuestGuard.tsx` — Bootstrap overrides in `theme.css` handle their styling automatically via cascade.

> **AdminLTELayout.test.tsx** — must be updated alongside `layout.tsx` to reflect `navbar-dark` class.

**Structure Decision**: Single-project web app. All theme changes are centralized in one new CSS file. Only components where the HTML class names must change (HeroSection, ProtectedLayout) require direct file edits.

## theme.css Specification

The following defines the complete structure of `src/app/theme.css`:

### Design Tokens

```css
:root {
  --mg-primary:        #6B46C1;
  --mg-primary-hover:  #9F7AEA;
  --mg-bg:             #0F0F0F;
  --mg-bg-secondary:   #1A202C;
  --mg-bg-card:        #2D3748;
  --mg-text:           #FFFFFF;
  --mg-text-muted:     #A0AEC0;
  --mg-error:          #FC8181;
  --mg-transition:     200ms ease-in-out;
}
```

### Global Base Styles

```css
body {
  background-color: var(--mg-bg) !important;
  color: var(--mg-text) !important;
}

label {
  color: var(--mg-text-muted);
}

/* Keyboard focus ring for all interactive elements (FR-017) */
:focus-visible {
  outline: 2px solid var(--mg-primary-hover);
  outline-offset: 2px;
}

/* Suppress all transitions for users who prefer reduced motion (FR-016) */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition: none !important;
    animation: none !important;
  }
}
```

### Bootstrap Primary Color Override

```css
.btn-primary {
  background-color: var(--mg-primary);
  border-color: var(--mg-primary);
  color: #fff;
  transition: background-color var(--mg-transition), border-color var(--mg-transition);
}
.btn-primary:hover,
.btn-primary:focus {
  background-color: var(--mg-primary-hover);
  border-color: var(--mg-primary-hover);
}
.btn-outline-primary {
  color: var(--mg-primary-hover);
  border-color: var(--mg-primary);
}
.btn-outline-primary:hover {
  background-color: var(--mg-primary);
  border-color: var(--mg-primary);
  color: var(--mg-text);
}
```

### Form Controls

```css
.form-control {
  background-color: var(--mg-bg-secondary);
  border-color: #4A5568;
  color: var(--mg-text);
  transition: border-color var(--mg-transition), box-shadow var(--mg-transition);
}
.form-control::placeholder {
  color: var(--mg-text-muted);
}
.form-control:focus {
  background-color: var(--mg-bg-secondary);
  border-color: var(--mg-primary-hover);
  color: var(--mg-text);
  box-shadow: 0 0 0 0.2rem rgba(159, 122, 234, 0.25);
}
.form-control.is-invalid {
  border-color: var(--mg-error);
}
.invalid-feedback {
  color: var(--mg-error);
}
```

### Cards

```css
.card {
  background-color: var(--mg-bg-card);
  border: 1px solid var(--mg-primary);
  box-shadow: 0 8px 32px rgba(107, 70, 193, 0.3);
}
.card-body {
  color: var(--mg-text);
}
```

### Alerts

```css
.alert-danger {
  background-color: rgba(252, 129, 129, 0.1);
  border-color: var(--mg-error);
  color: var(--mg-error);
}
```

### Landing Page Hero

```css
.mg-hero {
  min-height: 100vh;
  background: linear-gradient(to bottom, var(--mg-primary), var(--mg-primary-hover));
  background-attachment: fixed;
}
@media (max-width: 768px) {
  .mg-hero {
    background-attachment: scroll;
  }
}
@media (prefers-reduced-motion: reduce) {
  .mg-hero {
    background-attachment: scroll;
  }
}
.mg-hero-title {
  background: linear-gradient(to right, #fff, var(--mg-primary-hover));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### AdminLTE Navbar

```css
.main-header.navbar {
  background-color: var(--mg-primary) !important;
}
.main-header .nav-link,
.main-header .navbar-brand,
.main-header .btn-link {
  color: var(--mg-text) !important;
  transition: color var(--mg-transition);
}
.main-header .nav-link:hover,
.main-header .btn-link:hover {
  color: var(--mg-primary-hover) !important;
}
```

### AdminLTE Content Wrapper

```css
.content-wrapper {
  background-color: var(--mg-bg-secondary) !important;
}
```

## HeroSection Component Change

**File**: `src/components/landing/HeroSection.tsx`

Replace the outer wrapper `className` to use `mg-hero` instead of `container d-flex flex-column align-items-center justify-content-center min-vh-100`, and add `mg-hero-title` to the main `<h1>` element. The centering utilities (`d-flex`, `flex-column`, `align-items-center`, `justify-content-center`) are preserved alongside `mg-hero`. Note that `container` and `min-vh-100` are removed — `mg-hero` already sets `min-height: 100vh` and the gradient must span the full viewport width, not be constrained by Bootstrap's container padding.

**Before** (outer wrapper):
```tsx
<div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
  <h1 className="display-4 font-weight-bold mb-3 text-center">
```

**After**:
```tsx
<div className="mg-hero d-flex flex-column align-items-center justify-content-center">
  <h1 className="mg-hero-title display-4 font-weight-bold mb-3 text-center">
```

## ProtectedLayout Component Change

**File**: `src/app/(protected)/layout.tsx`

**Before**:
```tsx
<nav className="main-header navbar navbar-expand navbar-white navbar-light">
```

**After**:
```tsx
<nav className="main-header navbar navbar-expand navbar-dark">
```

## Complexity Tracking

*No constitution violations — no entries required.*

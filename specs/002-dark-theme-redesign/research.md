# Research: Visual Redesign — Dark Purple Theme

**Feature**: 002-dark-theme-redesign | **Date**: 2026-03-14

## Decision 1: CSS Override Strategy

**Decision**: CSS custom properties (`:root { --mg-* }`) + specificity-based Bootstrap/AdminLTE overrides in a single `theme.css` file, imported last in `globals.css`.

**Rationale**: Bootstrap 4.6 compiles SCSS into static CSS — its color variables (`$primary`, `$danger`) are not available at runtime as CSS custom properties. The correct override strategy is the CSS cascade: importing `theme.css` after Bootstrap and AdminLTE in `globals.css` guarantees our rules take precedence without touching either framework's source. CSS custom properties on `:root` serve as design tokens for any new CSS written during this and future features.

**Alternatives considered**:
- **SCSS variable override (compile-time)**: Requires changing the build pipeline to compile Bootstrap/AdminLTE from source SCSS — adds significant complexity and is out of scope.
- **CSS Modules per component**: Fragments the theme across many files; harder to maintain consistency; cannot override global Bootstrap selectors from module scope.
- **Inline styles**: Prohibited by Constitution Principle III for static values.

---

## Decision 2: Parallax Technique

**Decision**: CSS `background-attachment: fixed` on `.mg-hero`. Disabled on screens ≤ 768px via `@media (max-width: 768px) { background-attachment: scroll }`.

**Rationale**: Zero JavaScript, zero dependencies. `background-attachment: fixed` creates a parallax effect natively in the browser's compositor layer with no layout thrashing. On mobile, fixed backgrounds are janky on iOS Safari (painted on scroll, not composited) — switching to `scroll` on mobile gives a clean static gradient with no performance risk. This satisfies FR-015 and SC-004 (per Clarification Q1: parallax disabled on ≤ 768px).

**Alternatives considered**:
- **IntersectionObserver + CSS transform**: More control but requires client-side JS, `"use client"` directive, and more complex implementation for marginal visual improvement.
- **Third-party libraries (rellax.js, etc.)**: Prohibited by user constraint and Constitution Principle V.

---

## Decision 3: AdminLTE Navbar Dark Theming

**Decision**: Override `.main-header.navbar` background and text colors via `theme.css`. Change Bootstrap class `navbar-white navbar-light` → `navbar-dark` in `layout.tsx`.

**Rationale**: Bootstrap's `navbar-light` sets light-colored text on links/brand and `navbar-white` sets a white background — both conflict with the dark purple theme. Removing them and adding `navbar-dark` (Bootstrap 4's dark navbar variant) correctly sets icon and text contrast to white. The purple background is applied by our `.main-header.navbar { background-color: var(--mg-primary) }` override in `theme.css`. AdminLTE's own skin system is not used as it requires additional JS initialization and an extra CSS file per skin.

**Alternatives considered**:
- **AdminLTE skin system (skin-purple, skin-dark)**: More "official" but requires loading a skin CSS + initializing via JS body class — unnecessary complexity for a single navbar color change.
- **`!important` everywhere without changing `navbar-light`**: Fragile; Bootstrap updates could break it. Explicit class removal is cleaner.

---

## Decision 4: Gradient Text on Hero Title

**Decision**: CSS `background-clip: text` + `color: transparent` via `.mg-hero-title` class. Gradient direction: left (white) → right (`#9F7AEA`), complementing the vertical page gradient.

**Rationale**: Pure CSS, zero dependencies, excellent browser support across all modern browsers. Accessible — screen readers read the text content regardless of visual treatment. No SVG or image overhead.

**Alternatives considered**:
- **SVG `<text>` with fill gradient**: Not accessible without additional aria-hidden + visually hidden text duplication.
- **Image replacement**: Not scalable, bad for SEO and accessibility.

---

## Decision 5: Error State Color

**Decision**: Soft red `#FC8181` for `.form-control.is-invalid` border and `.invalid-feedback` text.

**Rationale**: Per Clarification Q2 (Session 2026-03-14), user selected `#FC8181` over Bootstrap's default `#dc3545`. Contrast ratio of `#FC8181` on `#2D3748` (card background) ≈ 4.6:1 — passes WCAG AA minimum.

**Alternatives considered**: Bootstrap default `#dc3545` and amber `#ED8936` — both rejected by user.

---

## CSS Design Tokens Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--mg-primary` | `#6B46C1` | Buttons, card borders, navbar background |
| `--mg-primary-hover` | `#9F7AEA` | Hover/focus states, gradient accent |
| `--mg-bg` | `#0F0F0F` | Page background (`body`) |
| `--mg-bg-secondary` | `#1A202C` | Content wrappers, form inputs |
| `--mg-bg-card` | `#2D3748` | Card surfaces |
| `--mg-text` | `#FFFFFF` | Primary text |
| `--mg-text-muted` | `#A0AEC0` | Labels, placeholders, secondary text |
| `--mg-error` | `#FC8181` | Validation error borders and messages |
| `--mg-transition` | `200ms ease-in-out` | All interactive state transitions |

---

## Decision 6: prefers-reduced-motion Scope

**Decision**: A single blanket rule `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }` suppresses all CSS transitions and animations globally, in addition to the parallax-specific `background-attachment: scroll` already in `.mg-hero`.

**Rationale**: Per Clarification Q5 (Session 2026-03-14), user selected "suppress all transitions." This matches WCAG 2.3 SC 2.3.3 (AAA) and the widespread industry practice of a single global reset rule. A single selector is simpler and more maintainable than per-component rules, and eliminates the risk of missing any transition.

**Alternatives considered**: Parallax-only suppression (rejected — misses hover/focus transitions which can also cause discomfort for users with vestibular disorders).

---

## Decision 7: Keyboard Focus Ring Scope

**Decision**: `:focus-visible { outline: 2px solid var(--mg-primary-hover); outline-offset: 2px; }` applies the purple focus ring to all interactive elements globally.

**Rationale**: Per Clarification Q6 (Session 2026-03-14), user selected "all interactive elements." Using `:focus-visible` (not `:focus`) avoids showing the ring on mouse clicks while preserving it for keyboard navigation — satisfying WCAG AA 2.4.7. A single global rule is more maintainable than per-element rules and ensures no interactive element is accidentally left without a visible keyboard indicator.

**Alternatives considered**: Form-fields-only (rejected — buttons and navbar items are also keyboard-navigable and must meet WCAG 2.4.7).

---

## Files Affected

| File | Action | Reason |
|------|--------|--------|
| `src/app/globals.css` | Modify | Add `@import './theme.css'` |
| `src/app/theme.css` | **Create** | All design tokens + Bootstrap/AdminLTE overrides |
| `src/components/landing/HeroSection.tsx` | Modify | Add `mg-hero` wrapper + `mg-hero-title` on heading |
| `src/app/(protected)/layout.tsx` | Modify | `navbar-white navbar-light` → `navbar-dark` |
| `src/components/landing/HeroSection.test.tsx` | Modify | Update CSS class assertions |
| `src/app/(protected)/AdminLTELayout.test.tsx` | Modify | Update navbar class assertions |

No other component files need changes — CSS cascade overrides Bootstrap classes automatically on Button, FormField, LoginForm, RegisterForm, and DashboardContent.

# Theme System Quickstart

## Overview

All visual theme customizations live in `src/app/theme.css`, imported last in `src/app/globals.css`. This guarantees our overrides cascade over Bootstrap 4.6 and AdminLTE 3.2 without touching either framework's source files.

## Design Tokens

CSS custom properties defined on `:root`. Use them in all new CSS to stay consistent:

```css
var(--mg-primary)        /* #6B46C1 — purple, buttons, card borders, navbar bg */
var(--mg-primary-hover)  /* #9F7AEA — hover/focus states, gradient accent */
var(--mg-bg)             /* #0F0F0F — page background */
var(--mg-bg-secondary)   /* #1A202C — form inputs, content wrappers */
var(--mg-bg-card)        /* #2D3748 — card surfaces */
var(--mg-text)           /* #FFFFFF — primary text */
var(--mg-text-muted)     /* #A0AEC0 — labels, placeholders, secondary text */
var(--mg-error)          /* #FC8181 — validation error borders and messages */
var(--mg-transition)     /* 200ms ease-in-out — interactive state transitions */
```

## Using the Theme on New Pages

**Public pages (Bootstrap 4)**:
- Dark background and typography are applied globally to `body` — no extra class needed.
- Bootstrap `.card` is automatically themed with purple border and dark background.
- `.btn-primary` and `.btn-outline-primary` are automatically themed with purple colors.
- Form controls (`.form-control`) use dark background and show purple focus ring.

**Protected pages (AdminLTE)**:
- `.content-wrapper` background is overridden automatically.
- Use `navbar-dark` (not `navbar-light` or `navbar-white`) on any new navbar.

## Landing Page Hero Section

Use `.mg-hero` for a full-viewport hero with vertical purple gradient + parallax on desktop (static on mobile ≤ 768px):

```tsx
<div className="mg-hero d-flex flex-column align-items-center justify-content-center">
  <h1 className="mg-hero-title display-4 font-weight-bold text-center">
    Mystery Gifter
  </h1>
</div>
```

## Extending the Theme

1. Add new overrides to `src/app/theme.css` only.
2. Never add static color values as inline `style` props or hardcoded hex values in component files.
3. Always reference design tokens via `var(--mg-*)`.
4. For new interactive elements, always add a `transition: ... var(--mg-transition)` rule.

## Accessibility Checklist for New Components

- All text on dark backgrounds must maintain ≥ 4.5:1 contrast (WCAG AA).
- All interactive elements must have a visible focus indicator (purple glow via `box-shadow`).
- Parallax/animation effects must not appear on `@media (prefers-reduced-motion: reduce)`.

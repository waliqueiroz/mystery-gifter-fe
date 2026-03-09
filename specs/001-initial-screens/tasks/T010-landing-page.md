# T010 — Landing page + HeroSection component (US1)

**Story**: US1 — Visitor Discovers Mystery Gifter
**Branch**: `task/001-T010-landing-page`
**Stack on**: `task/001-T009-route-groups`
**Parallel**: Yes (alongside T011, T012, T013 — different files)

## Goal

Implement the public landing page with the Mystery Gifter brand, product description, and two CTAs ("Entrar" → `/login`, "Criar conta" → `/registro`). Wrap in `GuestGuard` so authenticated users are redirected to `/dashboard`.

## Files

- `src/components/landing/HeroSection.tsx` — Bootstrap 4 hero section with brand name, description, and two `.btn` links
- `src/components/landing/HeroSection.test.tsx` — tests: renders brand name, renders "Entrar" link to /login, renders "Criar conta" link to /registro
- `src/app/(public)/page.tsx` — replace placeholder; import `HeroSection` + `GuestGuard`; Server Component (no "use client" needed — GuestGuard handles it internally)

## UI requirements

- Heading: "Mystery Gifter"
- Subheading: description of the product (amigo secreto / secret-gift groups)
- CTA 1: `<Link href="/login">` styled as `btn btn-primary` — text: "Entrar"
- CTA 2: `<Link href="/registro">` styled as `btn btn-outline-primary` — text: "Criar conta"
- Must be responsive (Bootstrap 4 grid)

## Acceptance Criteria

- [ ] `npm test src/components/landing/HeroSection.test.tsx` passes
- [ ] Visiting `/` shows landing page with both CTAs
- [ ] Authenticated user visiting `/` is redirected to `/dashboard`
- [ ] All text in pt-BR

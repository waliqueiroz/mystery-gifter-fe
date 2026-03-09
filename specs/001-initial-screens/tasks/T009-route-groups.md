# T009 — App Router route group structure

**Story**: Foundational
**Branch**: `task/001-T009-route-groups`
**Stack on**: `task/001-T003-root-layout`

## Goal

Create the Next.js App Router route group directories and placeholder page files for all four screens. This establishes the routing skeleton so all subsequent tasks have a clear target path.

## Files to create

- `src/app/(public)/page.tsx` — replace existing `src/app/page.tsx` content; minimal placeholder returning `<main>Em construção</main>`
- `src/app/(public)/login/page.tsx` — placeholder
- `src/app/(public)/registro/page.tsx` — placeholder
- `src/app/(protected)/layout.tsx` — minimal `"use client"` layout returning `<>{children}</>`
- `src/app/(protected)/dashboard/page.tsx` — placeholder
- `src/app/page.tsx` — remove (route moves to `(public)/page.tsx`)
- `src/app/page.module.css` — remove (no longer needed)

## Acceptance Criteria

- [ ] `http://localhost:3000/` resolves (no 404)
- [ ] `http://localhost:3000/login` resolves
- [ ] `http://localhost:3000/registro` resolves
- [ ] `http://localhost:3000/dashboard` resolves
- [ ] `npm run build` succeeds with no errors

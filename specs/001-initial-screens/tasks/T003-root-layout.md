# T003 — Root layout with Bootstrap 4 + AdminLTE CSS imports

**Story**: Foundational
**Branch**: `task/001-T003-root-layout`
**Stack on**: `task/001-T001-project-setup`
**Parallel**: Yes

## Goal

Update the root Next.js layout to import Bootstrap 4 and AdminLTE 3.2 CSS globally, replacing the default Next.js scaffold styles. Also update page metadata to reflect Mystery Gifter branding.

## Files

- `src/app/globals.css` — replace content with Bootstrap 4 + AdminLTE imports plus any global resets
- `src/app/layout.tsx` — update `metadata` title/description; remove Geist font imports; keep `<html lang="pt-BR">`; import `globals.css`

## Acceptance Criteria

- [ ] `<html lang="pt-BR">` set in root layout
- [ ] Bootstrap 4 CSS loaded (verify `btn btn-primary` class renders correctly in browser)
- [ ] AdminLTE CSS loaded (verify `.content-wrapper` class available)
- [ ] No Tailwind or Geist font references remain
- [ ] `npm run build` succeeds

# T005 — Shared UI: Button component

**Story**: Foundational
**Branch**: `task/001-T005-ui-button`
**Stack on**: `task/001-T001-project-setup`
**Parallel**: Yes

## Goal

Create a reusable `Button` component with Bootstrap 4 styling, loading state support, and disabled state. Used across all forms and CTAs.

## Files

- `src/components/ui/Button/Button.tsx` — Bootstrap 4 `btn` with variant, loading, disabled props
- `src/components/ui/Button/Button.test.tsx` — tests: renders text, shows loading spinner, disables when loading, calls onClick, does not call onClick when disabled

## Props interface

```ts
interface ButtonProps {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'  // maps to btn-primary etc.
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}
```

## Acceptance Criteria

- [ ] Renders with correct Bootstrap class (`.btn.btn-primary` etc.)
- [ ] When `loading=true`: button is disabled and shows a spinner (aria-label="Carregando")
- [ ] When `disabled=true`: `onClick` is NOT called
- [ ] `npm test src/components/ui/Button/Button.test.tsx` passes

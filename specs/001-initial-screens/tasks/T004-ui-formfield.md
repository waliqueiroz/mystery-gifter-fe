# T004 — Shared UI: FormField component

**Story**: Foundational
**Branch**: `task/001-T004-ui-formfield`
**Stack on**: `task/001-T001-project-setup`
**Parallel**: Yes

## Goal

Create a reusable `FormField` component that renders a Bootstrap 4 form group with label, input, and inline error message. Used by login and registration forms.

## Files

- `src/components/ui/FormField/FormField.tsx` — Bootstrap 4 `.form-group` wrapper with `label`, `input.form-control`, and optional `.invalid-feedback`
- `src/components/ui/FormField/FormField.test.tsx` — tests: renders label, renders input, shows error when provided, hides error when not provided

## Props interface

```ts
interface FormFieldProps {
  id: string
  label: string
  type?: string        // default 'text'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  placeholder?: string
  required?: boolean
}
```

## Acceptance Criteria

- [ ] Component renders with Bootstrap 4 classes (`.form-group`, `.form-control`)
- [ ] Error message uses `.invalid-feedback` and `.is-invalid` on input
- [ ] `npm test src/components/ui/FormField/FormField.test.tsx` passes
- [ ] All tests use React Testing Library (no implementation detail access)

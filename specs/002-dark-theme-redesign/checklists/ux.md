# UX Checklist: Visual Redesign — Dark Purple Theme

**Purpose**: Author gate — validate UX requirement quality before opening implementation PRs. Ensures requirements are complete, unambiguous, and measurable enough to guide implementation without rework.
**Created**: 2026-03-14
**Feature**: [spec.md](../spec.md) | [plan.md](../plan.md)

---

## Requirement Completeness

- [ ] CHK001 - Are interaction state requirements (normal, hover, focus, active, disabled) defined for every interactive element type — buttons, links, form fields, navbar items? [Completeness, Spec §FR-002, FR-003]
- [ ] CHK002 - Are visual requirements defined for the form submission loading state (button during async request) across login and register pages? [Completeness, Gap]
- [ ] CHK003 - Are requirements specified for the `btn-link` variant used by the logout button in the dashboard — does it inherit the dark theme or require a separate rule? [Completeness, Spec §US4]
- [ ] CHK004 - Does the spec define the visual treatment for text links (`<a>`) outside of buttons and navbar, such as the "Já tem conta? Entrar" links on the register page? [Completeness, Gap]
- [ ] CHK005 - Are scroll bar styling requirements defined or explicitly left as browser default? [Completeness, Gap]

---

## Requirement Clarity

- [ ] CHK006 - Is "subtle parallax effect" in US2 quantified with a specific scroll speed ratio or movement range? [Clarity, Spec §US2, Clarifications §Session 2026-03-14]
- [ ] CHK007 - Is "smooth transition" for hover/focus states defined with a specific easing function, or only a duration (≤ 200ms)? [Clarity, Spec §FR-003]
- [ ] CHK008 - Is "shadow that conveys depth" in FR-007 defined with specific shadow parameters (offset, blur, spread, color, opacity)? [Clarity, Spec §FR-007]
- [ ] CHK009 - Is "subtle purple border" in FR-007 quantified with a specific border-width value? [Clarity, Spec §FR-007]
- [ ] CHK010 - Is "very dark gray" for `.content-wrapper` background (FR-011) explicitly resolved to a single hex value (#1A202C or #2D3748), or is it left ambiguous? [Clarity, Spec §FR-011]
- [ ] CHK011 - Is the gradient direction for `.mg-hero-title` text (FR-006) defined? The plan specifies left→right but this is not in the spec. [Clarity, Plan §theme.css Specification, Gap]

---

## Requirement Consistency

- [ ] CHK012 - Are hover color requirements consistent between buttons (FR-003: `#9F7AEA`) and navbar items (FR-010/plan)? Both should resolve to the same `--mg-primary-hover` token. [Consistency, Spec §FR-003, FR-010]
- [ ] CHK013 - Is the card dark background (`--mg-bg-card: #2D3748`) consistent with the form input background (`--mg-bg-secondary: #1A202C`) — are these distinctions intentional and documented? [Consistency, Plan §Design Tokens]
- [ ] CHK014 - Are the focus ring style requirements for form fields (FR-008: purple glow) consistent with focus indicator requirements for buttons and navbar items? [Consistency, Spec §FR-003, FR-008]
- [ ] CHK015 - Is the error color `#FC8181` defined both in spec (via Clarification Q2) and in the plan design tokens — are the two sources in sync? [Consistency, Spec §Clarifications, Plan §Design Tokens]

---

## Acceptance Criteria Quality

- [ ] CHK016 - Can SC-001 ("cohesive visual identity — verifiable by comparative visual inspection") be objectively verified without subjective judgment? Is a more measurable criterion possible? [Measurability, Spec §SC-001]
- [ ] CHK017 - Can SC-007 ("no user identifies a visual identity break — validatable by stakeholder review") be verified with a defined number of reviewers or a structured test? [Measurability, Spec §SC-007]
- [ ] CHK018 - Is SC-003 ("≤ 200ms feedback") verifiable in a reproducible way — does the spec specify under what conditions (device, browser, load) this is measured? [Measurability, Spec §SC-003]
- [ ] CHK019 - Does SC-005 ("no component recreated from scratch — verifiable by absence of duplicated HTML markup") provide a clear enough criterion for a reviewer to make a pass/fail decision? [Measurability, Spec §SC-005]

---

## Scenario Coverage

- [ ] CHK020 - Are requirements defined for the visual appearance of form fields in a `disabled` state (e.g., button disabled during submission, read-only inputs)? [Coverage, Gap]
- [ ] CHK021 - Are requirements defined for the spinner component inside `Button.tsx` (loading state) under the dark theme — should the spinner color change? [Coverage, Gap]
- [ ] CHK022 - Are requirements defined for the visual treatment of Bootstrap `.alert-success` or `.alert-warning` variants, or are only `.alert-danger` overrides in scope? [Coverage, Spec §FR-014, Gap]
- [ ] CHK023 - Are requirements specified for the visual state when an authenticated user's session expires and the dashboard is still open (e.g., the 401 redirect flow)? [Coverage, Edge Case]

---

## Edge Case Coverage

- [ ] CHK024 - Is the visual behavior defined when both `is-invalid` and focus states are active simultaneously on a form field (purple focus ring + red border — which wins)? [Edge Case, Spec §FR-008]
- [ ] CHK025 - Is the visual treatment defined for very long text inside cards (e.g., long error messages in `.alert-danger`) — truncation, wrapping, overflow? [Edge Case, Gap]
- [ ] CHK026 - Is the gradient text fallback defined for browsers that do not support `background-clip: text` (e.g., older Edge versions)? [Edge Case, Spec §FR-006]
- [ ] CHK027 - Are requirements defined for the `prefers-reduced-motion` media query beyond just disabling parallax — should all CSS transitions also be suppressed? [Edge Case, Spec §Clarifications]

---

## Non-Functional & Accessibility Requirements (subcategory of UX)

- [ ] CHK028 - Is the minimum contrast ratio requirement (4.5:1 WCAG AA) explicitly applied to all text variants — body, labels, placeholders, error messages, and button text? [Accessibility, Spec §FR-004, SC-002]
- [ ] CHK029 - Is a visible focus indicator required for keyboard navigation beyond form fields — specifically for buttons and navbar items? [Accessibility, Gap]
- [ ] CHK030 - Are requirements defined for icon-only interactive elements (Font Awesome icons used without visible text label) — do they require `aria-label` or `title` attributes? [Accessibility, Spec §FR-009]
- [ ] CHK031 - Does the spec address the `prefers-reduced-motion` requirement beyond parallax — are all CSS `transition` animations within scope of this media query rule? [Accessibility, Spec §Clarifications, Gap]
- [ ] CHK032 - Is the CLS (Cumulative Layout Shift ≤ 0.1) requirement in the plan (Constitution §IV) addressed by the spec — does the gradient/parallax background risk causing layout shift on load? [Performance, Plan §Constitution Check]

---

## Dependencies & Assumptions

- [ ] CHK033 - Is the assumption "Font Awesome Free is already available" validated against the current `globals.css` import? The plan confirms it, but the spec lists it only as an assumption. [Assumption, Spec §Assumptions]
- [ ] CHK034 - Is the assumption "default Bootstrap/AdminLTE font is sufficient" documented as a decision — or could a stakeholder request a custom font mid-implementation? [Assumption, Spec §Assumptions]
- [ ] CHK035 - Are future pages guaranteed to inherit the dark theme automatically via `body` and global CSS rules — is this inheritance assumption explicitly documented as a design system rule? [Assumption, Spec §Assumptions, quickstart.md]

---

## Notes

- Mark items as complete with `[x]` before opening implementation PRs
- Items marked `[Gap]` are potential spec updates needed before implementation
- Items marked `[Ambiguity]` may require a quick decision logged in `spec.md §Clarifications`
- Focus on CHK006–CHK011 (Clarity) and CHK020–CHK022 (Coverage) as highest-risk gaps

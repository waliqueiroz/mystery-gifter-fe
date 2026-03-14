# Feature Specification: Visual Redesign — Dark Purple Theme

**Feature Branch**: `002-dark-theme-redesign`
**Created**: 2026-03-14
**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Design System (Priority: P1)

As a Mystery Gifter developer or designer, I want all pages of the system to share a unified visual identity — dark background, purple palette, modern typography — so that the product conveys sophistication and modernity consistently.

**Why this priority**: The visual foundation is a prerequisite for all other stories. Without it, per-page customizations become incoherent.

**Independent Test**: Can be validated by opening the landing page, login, register, and dashboard in sequence and verifying that all share the same color palette, typography, and general style.

**Acceptance Scenarios**:

1. **Given** the design system is applied, **When** a user accesses any page of the application, **Then** they see a dark background (near black), white/light gray text, and highlights in purple tones.
2. **Given** the design system is applied, **When** an interactive element (button, link, field) receives focus or hover, **Then** it displays a smooth transition with a light purple tone as visual feedback.
3. **Given** the design system is applied, **When** a user navigates between public pages and the protected area (dashboard), **Then** they perceive no visual break — the identity is continuous.

---

### User Story 2 - Immersive Landing Page (Priority: P2)

As a Mystery Gifter visitor, I want the landing page to make a striking and modern first impression, with a dark/purple gradient background, a highlighted title, and visually attractive action buttons, so that I feel motivated to create an account or log in.

**Why this priority**: The landing page is the user's first contact with the product; it directly impacts conversion.

**Independent Test**: Can be tested in isolation by accessing the public root route and verifying the visual while not logged in.

**Acceptance Scenarios**:

1. **Given** a visitor accesses the landing page, **When** the page loads, **Then** they see a dark background with a purple gradient, a main title highlighted with a gradient text effect, and a subtitle legible in light gray.
2. **Given** a visitor is on the landing page, **When** they scroll the page, **Then** they experience a subtle parallax effect (background elements move at a different speed than the content), without harming legibility or performance.
3. **Given** a visitor is on the landing page, **When** they view the call-to-action buttons ("Entrar" and "Criar conta"), **Then** the buttons are in primary purple with white text, and on hover they transition smoothly to a lighter purple.

---

### User Story 3 - Authentication Forms with Dark Theme (Priority: P3)

As a user who needs to log in or register, I want the login and register pages to follow the same dark/purple theme as the landing page, with elegant cards, well-contrasted form fields, and descriptive icons, so that the experience is smooth and trustworthy.

**Why this priority**: Forms are critical interaction points; visual consistency reduces friction and builds trust.

**Independent Test**: Can be validated by accessing `/login` and `/register` independently and verifying adherence to the theme.

**Acceptance Scenarios**:

1. **Given** a user accesses `/login` or `/register`, **When** the page loads, **Then** they see a dark background, a centered card with a purple border/shadow, and form fields with light gray placeholders.
2. **Given** a user is filling out a form, **When** they focus on an input field, **Then** the field displays a purple light border or glow as a visible focus indicator.
3. **Given** a user submits a form with invalid data, **When** validation errors are displayed, **Then** the affected fields show a soft red (#FC8181) border and the error message text is rendered in the same soft red tone.
3. **Given** a user looks at the password field, **Then** they see a Font Awesome lock icon next to the label or inside the field for semantic reinforcement.
4. **Given** a user submits the form, **When** the primary button is clicked, **Then** it displays immediate visual feedback (e.g., slight darkening) before processing the action.

---

### User Story 4 - Dashboard with Dark AdminLTE Theme (Priority: P4)

As an authenticated user, I want the dashboard to follow the same dark/purple theme, with navbar and sidebar in dark/purple tones and white text, so that the protected area is visually cohesive with the public pages.

**Why this priority**: The transition to the protected area should not be visually abrupt; coherence reinforces brand identity.

**Independent Test**: Can be tested by logging in and verifying the dashboard in isolation.

**Acceptance Scenarios**:

1. **Given** an authenticated user accesses the dashboard, **When** the page loads, **Then** they see a dark purple navbar with white text/icons, and a very dark gray content background.
2. **Given** the user is on the dashboard, **When** they hover over menu items or action buttons, **Then** the items display a light purple highlight.
3. **Given** the user is on the dashboard, **Then** the logout button is clearly visible with adequate contrast on the dark theme.

---

### Edge Cases

- What happens on devices with high contrast mode enabled in the operating system? The theme applies mandatorily but must ensure the minimum accessibility contrast ratio is maintained.
- What happens on very small screens (< 320px width)? The responsive layout must maintain legibility even with the dark theme.
- What happens if Font Awesome fails to load? Form fields must remain usable even without decorative icons.
- What happens if the user has a system preference for `prefers-color-scheme: light`? The system applies the dark theme regardless (mandatory dark mode as specified).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST apply a dark background (#0F0F0F or similar) as the default background color on all public and protected pages.
- **FR-002**: The system MUST use dark purple (#6B46C1) as the primary color for action buttons, main links, and highlighted elements.
- **FR-003**: The system MUST use light purple (#9F7AEA) as the hover/focus color for interactive elements, with a smooth animated transition (≤ 200ms).
- **FR-004**: The system MUST ensure that all text on dark backgrounds uses white (#FFFFFF) or very light gray to maintain a minimum contrast ratio of 4.5:1 (WCAG AA).
- **FR-005**: The landing page MUST include a soft vertical purple gradient background (top: #6B46C1 → bottom: #9F7AEA) and a subtle parallax effect triggered by scroll on screens > 768px wide.
- **FR-006**: The main title of the landing page MUST use gradient text to highlight the brand name.
- **FR-007**: The login and register pages MUST display a centered card with a subtle purple border and a shadow that conveys depth.
- **FR-008**: Form fields (login and register) MUST display a purple light border or glow when focused, and MUST display a soft red (#FC8181) border and error message text when in an invalid/error state.
- **FR-009**: The password field on authentication pages MUST include a descriptive Font Awesome icon (lock).
- **FR-010**: The dashboard navbar MUST have a dark purple background with white text and icons.
- **FR-011**: The dashboard main content background MUST use very dark gray (#1A202C or #2D3748).
- **FR-012**: The system MUST apply the dark theme mandatorily, regardless of the user's operating system color preference.
- **FR-013**: The theme MUST be implemented by overriding CSS variables and adding extra classes, without recreating Bootstrap 4.6 or AdminLTE 3.2 components from scratch.
- **FR-014**: All style customizations MUST preserve the mobile-first responsiveness inherited from Bootstrap/AdminLTE.
- **FR-015**: The landing page parallax effect MUST be implemented with performance-appropriate techniques and MUST be disabled on screens ≤ 768px wide, displaying a static gradient background instead.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All pages (landing, login, register, dashboard) present a cohesive visual identity with the purple/dark palette — verifiable by comparative visual inspection across pages.
- **SC-002**: 100% of text on dark backgrounds meets the minimum contrast ratio of 4.5:1 (WCAG AA), verifiable with accessibility tools.
- **SC-003**: All interactive elements (buttons, links, fields) display visual feedback within ≤ 200ms upon receiving hover or focus.
- **SC-004**: The landing page parallax effect is disabled on screens ≤ 768px (replaced by static gradient) and does not cause a drop below 60fps on mid-range desktop/large-tablet devices, verifiable via browser performance tools.
- **SC-005**: No Bootstrap 4.6 or AdminLTE 3.2 component is recreated from scratch — all customizations are applied via CSS overrides, verifiable by the absence of duplicated HTML markup in existing components.
- **SC-006**: The production build completes successfully after all style changes, with no critical errors.
- **SC-007**: When navigating between the landing page, login, register, and dashboard, no user identifies a visual identity break — validatable by stakeholder review.

## Clarifications

### Session 2026-03-14

- Q: Should the parallax effect be disabled or only optimized on mobile devices? → A: Disable parallax on mobile/tablet (≤ 768px); display a static gradient background instead.
- Q: What color should be used for form field validation error states? → A: Soft red (#FC8181) — harmonizes with the dark theme while remaining recognizable as an error indicator.
- Q: What direction should the landing page background gradient follow? → A: Vertical — top dark (#6B46C1) to bottom light (#9F7AEA).

## Assumptions

- The dark theme is mandatory and permanent — there is no light mode alternative in this version.
- The default font already available in the project (Bootstrap/AdminLTE) is sufficient; no new font via external CDN is needed at this stage.
- The landing page parallax effect will be implemented with pure CSS or minimal performance-appropriate JavaScript — heavy third-party libraries are out of scope.
- The defined color palette (#6B46C1 primary, #9F7AEA accent, #0F0F0F background, #1A202C/#2D3748 secondary) is approved by the requester and requires no additional brand validation.
- Font Awesome Free icons are already available in the project; no new dependency needs to be added.
- The affected screens are: landing page, login, register, and dashboard — future additional pages will inherit the established design system through the global styles file.

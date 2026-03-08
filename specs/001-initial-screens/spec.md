# Feature Specification: Mystery Gifter — Initial Screens

**Feature Branch**: `001-initial-screens`
**Created**: 2026-03-08
**Status**: Draft
**Input**: User description — Landing page, login screen, registration screen, and dummy dashboard for the Mystery Gifter secret-gift-group management application.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitor Discovers Mystery Gifter (Priority: P1)

A visitor (not yet logged in) lands on the application URL and sees the Mystery Gifter landing page.
The page clearly communicates what the product is — a platform for managing secret-gift groups
(amigo secreto) — and provides prominent calls-to-action to log in or register.

**Why this priority**: This is the entry point of the entire application. Without a working landing
page, no user can discover or access the product. It is the foundation for all other stories.

**Independent Test**: Navigate to the root URL without any active session. The landing page renders
with the product name, a brief description, and visible buttons to log in and to register.

**Acceptance Scenarios**:

1. **Given** a visitor with no active session, **When** they open the application URL, **Then** the
   landing page is displayed with the Mystery Gifter brand and a clear description of the product.
2. **Given** a visitor on the landing page, **When** they click the login call-to-action,
   **Then** they are taken to the login screen.
3. **Given** a visitor on the landing page, **When** they click the register call-to-action,
   **Then** they are taken to the registration screen.
4. **Given** an already authenticated user, **When** they navigate to the landing page,
   **Then** they are automatically redirected to the dashboard.

---

### User Story 2 — New User Registers (Priority: P1)

A new user navigates to the registration screen, fills in their first name, last name, e-mail,
password, and password confirmation, and submits the form. Upon success, they are automatically
logged in (JWT stored) and redirected to the dashboard. Upon failure, a clear error message is
shown and they remain on the registration screen.

**Why this priority**: Without registration, new users cannot access the system at all. It is
co-critical with login for the MVP.

**Independent Test**: Fill the registration form with valid unique data and verify the user is
redirected to the dashboard without needing to log in manually. Submit with an already-used
e-mail and verify an error message appears.

**Acceptance Scenarios**:

1. **Given** a new user on the registration screen, **When** they submit valid and unique data
   (nome, sobrenome, e-mail, senha, confirmação de senha), **Then** their account is created,
   the JWT returned by the backend is stored in `localStorage`, and they are redirected to
   the dashboard.
2. **Given** a user on the registration screen, **When** they submit with an e-mail already
   registered, **Then** a clear error message is displayed and they remain on the screen.
3. **Given** a user on the registration screen, **When** the password and password confirmation
   do not match, **Then** an inline validation error is shown before any network request is made.
4. **Given** a user on the registration screen, **When** any required field is empty,
   **Then** inline validation errors are shown for the empty fields before submitting.
5. **Given** a network failure during registration submission, **When** the request fails,
   **Then** a user-friendly error message is shown and the user can retry.
6. **Given** an already authenticated user, **When** they navigate to the registration screen,
   **Then** they are automatically redirected to the dashboard.

---

### User Story 3 — User Logs In (Priority: P1)

A registered user navigates to the login screen, enters their credentials (e-mail and password),
and is authenticated by the system. Upon success, they are redirected to the dashboard.
Upon failure, they receive a clear error message without leaving the login screen.

**Why this priority**: Login is the gateway for returning users. Co-critical with registration
for the MVP.

**Independent Test**: Enter valid credentials on the login screen and verify redirection to the
dashboard. Enter invalid credentials and verify an error message appears on the same screen.

**Acceptance Scenarios**:

1. **Given** a registered user on the login screen, **When** they submit valid credentials,
   **Then** they are authenticated and redirected to the dashboard.
2. **Given** a user on the login screen, **When** they submit invalid credentials,
   **Then** an error message is displayed and they remain on the login screen.
3. **Given** a user on the login screen, **When** they submit with one or both fields empty,
   **Then** inline validation errors are shown before any network request is made.
4. **Given** a network failure during login submission, **When** the request fails,
   **Then** a user-friendly error message is shown and the user can retry.
5. **Given** an already authenticated user, **When** they navigate to the login screen,
   **Then** they are automatically redirected to the dashboard.

---

### User Story 4 — Authenticated User Views Dashboard and Logs Out (Priority: P2)

An authenticated user lands on the dashboard after logging in or registering. The dashboard shows
a friendly placeholder message indicating that more features are coming. The user can log out,
which ends their session and returns them to the login screen.

**Why this priority**: The dashboard completes the authentication flow and provides the
logout mechanism. It is the post-authentication destination for all users.

**Independent Test**: With an active session, navigate to the dashboard URL. Verify the
placeholder message is visible and that clicking logout ends the session and redirects to login.

**Acceptance Scenarios**:

1. **Given** an authenticated user redirected to the dashboard, **When** the page loads,
   **Then** a placeholder message such as "O melhor está por vir" is prominently displayed.
2. **Given** an authenticated user on the dashboard, **When** they click the logout action,
   **Then** their JWT is removed from storage and they are redirected to the login screen (`/login`).
3. **Given** an unauthenticated user attempting to access the dashboard URL directly,
   **When** the page loads, **Then** they are redirected to the login screen.

---

### Edge Cases

- What happens when the backend API is unreachable during login or registration? The user sees
  a connectivity error message; the form remains interactive for retry.
- What happens if the user's session expires while on the dashboard? The frontend relies on the
  backend returning a 401 response; upon receiving 401, the JWT is removed from storage and the
  user is redirected to the login screen. The frontend does NOT proactively check token expiry.
- What happens if the user navigates back in the browser after logout? Protected pages redirect
  to the login screen; no cached protected content is served.
- What happens when the registration e-mail is already in use? A clear, human-readable error
  message is shown on the registration screen; no redirection occurs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a publicly accessible landing page at the application root URL.
- **FR-002**: Landing page MUST present the Mystery Gifter brand name and a brief description of
  the product's purpose (managing secret-gift groups).
- **FR-003**: Landing page MUST include a prominent call-to-action that navigates the visitor to
  the login screen.
- **FR-004**: Landing page MUST include a prominent call-to-action that navigates the visitor to
  the registration screen.
- **FR-005**: System MUST provide a registration screen with five fields: nome (first name),
  sobrenome (last name), e-mail, senha (password), and confirmação de senha (confirm password),
  and a visible link to the login screen (e.g., "Já tem conta? Entrar").
- **FR-006**: Registration form MUST validate that all five fields are non-empty before submitting;
  validation errors MUST be shown inline.
- **FR-007**: Registration form MUST validate that senha has a minimum length of 8 characters;
  a violation MUST show an inline error without making a network request.
- **FR-007b**: Registration form MUST validate that senha and confirmação de senha match before
  submitting; a mismatch MUST show an inline error without making a network request.
- **FR-008**: System MUST submit registration data to the backend REST API.
- **FR-009**: Upon successful registration, the JWT returned by the backend MUST be stored in
  `localStorage` and the user MUST be automatically redirected to the dashboard (auto-login;
  no manual login step required).
- **FR-010**: Upon failed registration, the user MUST see a clear, human-readable error message
  on the registration screen and MUST NOT be redirected.
- **FR-011**: System MUST provide a login screen with e-mail and password input fields, and a
  visible link to the registration screen (e.g., "Não tem conta? Criar conta").
- **FR-012**: Login screen MUST validate that both fields are non-empty before submitting to the
  backend; validation errors MUST be shown inline.
- **FR-013**: System MUST authenticate users against the existing backend REST API using the
  provided credentials.
- **FR-014**: Upon successful authentication, users MUST be automatically redirected to the dashboard.
- **FR-015**: Upon failed authentication, users MUST see a clear, human-readable error message on
  the login screen and MUST NOT be redirected.
- **FR-016**: System MUST display a dashboard screen accessible only to authenticated users.
- **FR-017**: Dashboard MUST display a placeholder message (e.g., "O melhor está por vir")
  communicating that more features are coming.
- **FR-018**: Dashboard MUST provide a logout action (button or link) visible to the authenticated user.
- **FR-019**: Upon logout, the JWT MUST be removed from `localStorage` and the user MUST be
  redirected to the login screen (`/login`).
- **FR-020**: Unauthenticated users attempting to access the dashboard MUST be redirected to the
  login screen.
- **FR-021**: Already-authenticated users accessing the login screen, registration screen, or
  landing page MUST be redirected to the dashboard.
- **FR-022**: All UI text (labels, placeholders, error messages, validation feedback, and
  copy) MUST be written in Brazilian Portuguese (pt-BR).

### Key Entities

- **User**: A person with an account in the system, identified by e-mail. Registration requires
  nome, sobrenome, e-mail, senha, and confirmação de senha. Managed by the backend.
  Represented in the frontend by a JWT stored in `localStorage` after login or registration.
- **Session**: The authentication state maintained on the client side after a successful login
  or registration. The JWT received in the response payload MUST be stored in `localStorage`.
  The session persists across page reloads until explicitly terminated (logout) or the token
  expires. On logout the token MUST be removed from `localStorage`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can reach the login screen or the registration screen from the landing
  page in a single interaction (one click or tap).
- **SC-002**: A new user can complete the full registration flow (landing → register → dashboard)
  in under 90 seconds on a standard internet connection.
- **SC-003**: A returning user can complete the full login flow (landing → login → dashboard)
  in under 60 seconds on a standard internet connection.
- **SC-004**: The dashboard is displayed within 2 seconds of a successful login or registration
  on a standard broadband connection.
- **SC-005**: 100% of unauthenticated requests to the dashboard URL are redirected to the login
  screen with no protected content exposed.
- **SC-006**: Login or registration failure displays an error message within 3 seconds of submission.
- **SC-007**: Logout completes and redirects the user within 1 second of the action being triggered.
- **SC-008**: All four screens (landing, registration, login, dashboard) render correctly on both
  desktop (≥1024 px) and mobile (≤768 px) viewports.

## Clarifications

### Session 2026-03-08

- Q: Where is the auth token stored client-side? → A: localStorage — the backend returns JWT in
  the response payload only (no Set-Cookie support); localStorage is the only viable persistent
  option. XSS risk must be mitigated by never storing sensitive data beyond the token itself and
  by enforcing a strict Content Security Policy.
- Q: Where is the user redirected after logout? → A: Login screen (`/login`).
- Q: How is session expiry managed on the frontend? → A: Trust JWT expiration — frontend does not
  proactively check `exp`; on any 401 response from the backend, the token is removed and the
  user is redirected to the login screen.
- Q: What is the UI language? → A: Português (pt-BR) — all UI text, error messages, validation
  messages, and labels MUST be written in Brazilian Portuguese.
- Q: What fields does the registration form collect? → A: Nome, sobrenome, e-mail, senha,
  confirmação de senha.
- Q: What happens after successful registration? → A: Auto-login — the JWT returned by the
  backend is stored in localStorage and the user is redirected to the dashboard immediately.
- Q: Is e-mail verification required after registration? → A: No — account is activated
  immediately; no verification e-mail is sent.
- Q: What are the password validation rules on the frontend? → A: Minimum 8 characters; no
  complexity requirements beyond length.
- Q: Should login and registration screens link to each other directly? → A: Yes — login screen
  MUST include a link to the registration screen; registration screen MUST include a link to
  the login screen.

## Assumptions

- Authentication and registration use e-mail + password credentials; no third-party OAuth or
  SSO in this iteration.
- The backend API returns a JWT in the response payload upon successful login or registration;
  the frontend stores it in `localStorage`. The backend does not set cookies.
- The backend API provides an endpoint to invalidate the token on logout.
- The entire UI is in Brazilian Portuguese (pt-BR): all labels, error messages, validation
  messages, and copy MUST be written in pt-BR. No i18n infrastructure is required at this stage.
- No password-recovery flow is in scope for this iteration.
- Landing page copy and visual design will be iterated after the functional baseline is delivered;
  this spec focuses on functional requirements, not final visual polish.

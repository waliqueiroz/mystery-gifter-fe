# Feature Specification: Groups & Profile Enhancements

**Feature Branch**: `004-groups-profile-features`  
**Created**: 2026-06-15  
**Status**: Draft  
**Input**: User description: "Implement the remaining frontend features that consume existing backend API endpoints which are currently unused or only partially used. No backend changes are required — all endpoints already exist."

## Clarifications

### Session 2026-06-15

- Q: When the groups list API call fails (network error, timeout, 500), what should the user see? → A: Display an error message in place of the list, with a "Tentar novamente" (retry) button.
- Q: Should the account creation date appear on the user profile page? → A: Yes — display name, surname, email, and account creation date in a human-readable format.
- Q: Should the status multiselect trigger a fetch on each individual toggle, or only after the user clicks an "Apply" button? → A: Fetch on each individual toggle — fully reactive, no confirmation step.
- Q: What happens when the user deselects all statuses in the multiselect — prevent it or allow it? → A: Allow it; when no status is selected, the status filter parameter is omitted from the request and the backend returns all groups regardless of status.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - GroupCard At-a-Glance Info (Priority: P1)

As a user browsing the groups list, I want to see how many members each group has and which groups I own, so that I can quickly assess group activity and my ownership without opening each group.

**Why this priority**: These are purely additive, self-contained changes to a single component that expose already-fetched data (both `user_count` and `owner_id` are already in the API response for the groups list). They deliver immediate value with minimal scope and zero new API calls.

**Independent Test**: Can be tested by loading the groups list page and verifying that each card shows a member count and that cards where the current user is the owner display a distinct ownership indicator.

**Acceptance Scenarios**:

1. **Given** a logged-in user on the groups list, **When** the page loads, **Then** each group card displays the number of members in that group (e.g., "3 membros").
2. **Given** a logged-in user who owns some groups, **When** the groups list loads, **Then** only the cards for groups they own show a visual ownership indicator.
3. **Given** a group with exactly one member, **When** the card is displayed, **Then** the member count reads "1 membro" (singular).
4. **Given** a logged-in user who owns no groups, **When** the groups list loads, **Then** no ownership indicator appears on any card.

---

### User Story 2 - Groups Discovery and Filtering (Priority: P2)

As a user, I want to search my groups by name, freely choose which statuses to display using a multiselect filter, and sort the list by creation date, so that I can find any group regardless of its state and see the most relevant results first.

**Why this priority**: Users currently have no way to locate groups by name, see their archived groups, or control the order of results — all significant usability gaps as the number of groups grows. This story touches the groups list page's data-fetching layer and introduces filter and sort controls, making it a slightly larger scope than Story 1 but still independent.

**Independent Test**: Can be tested by entering text in the search field and verifying filtered results appear; toggling statuses in the multiselect (including deselecting OPEN/MATCHED and selecting only ARCHIVED) and verifying the list reflects each combination; switching the sort order and verifying results reorder accordingly; and clearing all filters to verify the default list returns.

**Acceptance Scenarios**:

1. **Given** a user on the groups list, **When** they type a name into the search input, **Then** the list updates to show only groups whose name contains the typed text (case-insensitive).
2. **Given** a user on the groups list with OPEN and MATCHED selected by default, **When** they add "Arquivado" to the multiselect, **Then** archived groups are fetched and displayed alongside active groups, with a clear visual distinction.
3. **Given** a user with archived groups, **When** they navigate to the groups list, **Then** archived groups are not shown by default — only OPEN and MATCHED groups appear.
4. **Given** a user who deselects OPEN and MATCHED and selects only "Arquivado", **When** the filter is applied, **Then** only archived groups are shown.
5. **Given** a user who selects all three statuses (OPEN, MATCHED, ARQUIVADO), **When** the filter is applied, **Then** groups of all three statuses are shown together.
6. **Given** a user applying a name filter, **When** they clear the search input, **Then** the full list (for the currently selected statuses) is restored.
7. **Given** a user who has changed the status multiselect, **When** they log out and back in, **Then** the filter resets to the default selection (OPEN + MATCHED).
8. **Given** a user on the groups list, **When** the page loads, **Then** groups are ordered from most recently created to oldest by default.
9. **Given** a user on the groups list, **When** they switch the sort order to "Mais antigos", **Then** the list reloads with groups ordered from oldest to most recently created.
10. **Given** a user who changed the sort order, **When** they log out and back in, **Then** the sort order resets to the default (most recent first).

---

### User Story 3 - User Profile Page (Priority: P3)

As a logged-in user, I want a dedicated profile page where I can view my own account information (name, surname, and email), so that I can confirm my registered details at any time.

**Why this priority**: This is a standalone protected route that requires a new page and a sidebar navigation link. It delivers clear user value — being able to review one's own account data — and is fully independent of the group-related stories above.

**Independent Test**: Can be tested by clicking the profile link in the sidebar, verifying the page loads with the authenticated user's name, surname, and email, and confirming that unauthenticated access redirects to the login page.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they navigate to the profile page, **Then** they see their name, surname, and email displayed.
2. **Given** a logged-in user on the profile page, **When** the page loads, **Then** the data shown matches the account used to log in.
3. **Given** an unauthenticated user who attempts to access the profile URL directly, **When** the page loads, **Then** they are redirected to the login page.
4. **Given** a logged-in user in the dashboard, **When** they look at the sidebar navigation, **Then** a link to the profile page is visible.

---

### User Story 4 - Member Profile Details (Priority: P4)

As a user viewing a group's detail page, I want to click on any member's name to see their full name and email, so that I can identify members I may not recognize by display name alone.

**Why this priority**: This is an enhancement to an existing page (group detail) that requires a modal/overlay component and a new API call per interaction. It delivers value for groups with many members but is strictly additive — the group detail page is fully functional without it. Placed last as it has the most UI complexity relative to its incremental value.

**Independent Test**: Can be tested by opening a group with multiple members, clicking on a member name, and verifying a modal appears showing that member's full name and email. Can also verify that clicking outside the modal or pressing a dismiss action closes it.

**Acceptance Scenarios**:

1. **Given** a user viewing a group detail page, **When** they click on a member's name in the member list, **Then** a modal opens showing that member's name, surname, and email.
2. **Given** an open member modal, **When** the user dismisses it (close button or outside click), **Then** the modal closes and the group detail page returns to its normal state.
3. **Given** a group where the current user is listed as a member, **When** they click their own name, **Then** a modal opens with their own profile data.
4. **Given** the member list in a group detail page, **When** the page is loaded, **Then** all member names appear visually interactive (e.g., underlined or cursor changes on hover) to indicate they are clickable.
5. **Given** a user clicks a member name, **When** the profile data is still loading, **Then** a loading indicator is shown inside the modal.

---

### Edge Cases

- What happens when the groups list API call fails (initial load or after applying a filter)? An error message is displayed in place of the list, with a "Tentar novamente" button that re-triggers the same fetch. No stale data is kept visible.
- What happens when the search query matches zero groups? The list should display an empty state with a clear "Nenhum grupo encontrado" message rather than a blank area.
- What happens when a user applies filters and then logs out and back in? Filters reset to defaults (OPEN + MATCHED) — no persistence required.
- What happens when a member's profile data fails to load inside the modal? An error message should be shown within the modal without closing it, allowing the user to retry.
- What happens when a group has zero members? The member count on the card should display "0 membros".
- What happens if the authenticated user's ID cannot be determined when rendering GroupCards? The ownership indicator should not appear (fail safe — no false positives).
- What happens when a group's name is very long and the search input contains it partially? The partial match should still return the group.
- What happens when the user deselects all statuses in the multiselect? No status filter parameter is sent to the backend, which returns all groups regardless of status. The list displays all groups and the multiselect visually shows all options as unselected — this is a valid "show all" state, not an error.

## Requirements *(mandatory)*

### Functional Requirements

**GroupCard Enhancements (User Story 1)**

- **FR-001**: Each group card on the groups list MUST display the total number of members in that group.
- **FR-002**: The member count MUST use correct Portuguese grammatical number: "1 membro" (singular) vs "N membros" (plural).
- **FR-003**: Group cards where the authenticated user's ID matches the group's owner MUST display a visible ownership indicator (badge or icon).
- **FR-004**: The ownership indicator MUST NOT appear on cards owned by other users.

**Groups Discovery and Filtering (User Story 2)**

- **FR-005**: The groups list page MUST include a text input that filters the displayed groups by name.
- **FR-006**: Name filtering MUST be applied reactively — the list updates as the user types or when the user submits the search (with no more than a brief delay).
- **FR-007**: The groups list page MUST include a multiselect status filter exposing all three statuses: OPEN (Aberto), MATCHED (Sorteado), and ARCHIVED (Arquivado). The user MUST be able to select any combination freely — including selecting only ARCHIVED, only OPEN, all three at once, or any other mix.
- **FR-008**: The default selection of the status multiselect MUST be OPEN and MATCHED; ARCHIVED MUST be deselected by default.
- **FR-009**: Each individual toggle of a status option MUST immediately trigger a fresh data fetch for the resulting combination — there is no "Apply" button. The behavior is fully reactive: toggling OPEN off and then ARCHIVED on produces two sequential fetches, one per change. When no status is selected, the status filter parameter MUST be omitted from the request; the backend then returns all groups regardless of status.
- **FR-010**: Archived groups MUST be visually distinct from active groups (e.g., reduced opacity or a distinct status badge).
- **FR-011**: Clearing the name search input MUST restore the full group list for the currently selected statuses.
- **FR-012**: The status filter selection MUST NOT persist across sessions — on each new login the filter reverts to the default (OPEN + MATCHED).
- **FR-013**: The groups list page MUST include a sort order control with two options: "Mais recentes" (most recently created first) and "Mais antigos" (oldest first).
- **FR-014**: The default sort order MUST be "Mais recentes" (most recently created first).
- **FR-015**: Changing the sort order MUST immediately trigger a fresh data fetch with the new order applied.
- **FR-016**: The sort order selection MUST NOT persist across sessions — on each new login it reverts to the default (most recent first).
- **FR-016b**: If the groups list fetch fails (initial load or after a filter/sort change), the page MUST display an error message in place of the list and a "Tentar novamente" button that re-executes the same request. No stale list data MUST remain visible alongside the error.

**User Profile Page (User Story 3)**

- **FR-017**: The application MUST provide a protected route at `/profile` accessible only to authenticated users.
- **FR-018**: The profile page MUST display the authenticated user's first name, surname, email address, and account creation date. The creation date MUST be rendered in a human-readable format (e.g., "12 de março de 2025") — never as a raw ISO timestamp.
- **FR-019**: Unauthenticated access to `/profile` MUST redirect to the login page.
- **FR-020**: The dashboard sidebar MUST include a navigation link to the profile page.

**Member Profile Modal (User Story 4)**

- **FR-021**: Each member entry in the group detail member list MUST be interactive (clickable).
- **FR-022**: Clicking a member entry MUST open a modal displaying that member's first name, surname, and email.
- **FR-023**: The modal MUST display a loading state while the member's data is being fetched.
- **FR-024**: If fetching member data fails, the modal MUST display an error message without auto-closing.
- **FR-025**: The modal MUST provide a dismiss action (close button and/or clicking outside) that returns focus to the group detail page.

### Key Entities

- **GroupSummary**: Represents a group as returned by the groups list endpoint; includes identifier, name, status, member count, and owner identifier.
- **GroupStatus**: Enumerated state of a group — one of Open, Matched, or Archived; drives filtering behavior and visual presentation.
- **UserProfile**: A user's account information — first name, surname, email address, and account creation/update timestamps; fetched by user identifier.
- **GroupFilter**: The active set of filter parameters applied to the groups list — name search text, one or more selected statuses, and a sort order (most recent or oldest first).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify how many members are in any group without opening the group detail page.
- **SC-002**: Users can find any group by name using the search input within 2 interactions (type + view results).
- **SC-003**: Users can browse their archived groups within 2 interactions from the groups list page.
- **SC-004**: Users can view their own account information (name and email) within 3 clicks from anywhere in the dashboard.
- **SC-005**: Users can view any group member's full name and email within 1 click from the group detail page.
- **SC-006**: All new pages and interactive elements are accessible to authenticated users only — unauthenticated access results in a redirect to login in 100% of cases.
- **SC-007**: The groups list reflects filter changes within 1 second of user interaction under normal network conditions.

## Assumptions

- Filtering (name search and status) is applied server-side by passing query parameters to the groups list endpoint — no client-side array filtering is performed, as the backend already supports these parameters.
- Name search uses a debounce of approximately 300ms before triggering the API call, to avoid excessive requests while the user is still typing.
- The groups list does not require pagination UI changes for this feature; existing pagination behavior (if any) is preserved.
- Archived groups do not support the same actions as active groups (e.g., no invite, no draw actions visible on archived cards) — no interactive action buttons are shown on archived cards beyond the detail link.
- The profile page is read-only; no editing of user data is in scope (no PUT endpoint exists).
- The member profile modal fetches data on demand (on click) rather than pre-fetching all member profiles when the group detail page loads.
- The ownership indicator on GroupCard is a subtle UI element (small badge or icon) and does not replace the group name or status badge.
- Sorting is always by creation date; no other sort field (e.g., name, member count) is in scope for this feature.
- The sort order control is a simple two-option toggle or dropdown — not a multi-column sort.

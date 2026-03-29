# Feature Specification: Secret Santa Group Management

**Feature Branch**: `003-group-management`
**Created**: 2026-03-15
**Status**: Draft
**Input**: User description: "Core secret santa group management — list, create, view details, invite via card/link, manage members, draw names, view result, reopen/archive groups."

## Clarifications

### Session 2026-03-15

- Q: What is the exact behavior of "reopen" vs "archive"? → A: "Reopen" applies only to groups with status "draw completed". It clears all draw results so new members can join and a new draw can be made. "Archive" is a separate, permanent/irreversible action — archived groups cannot be restored.
- Q: When reopening a group, what happens to existing members? → A: Members remain in the group; only the draw results are cleared. The owner does not need to re-invite anyone.
- Q: From which states can a group be archived? → A: Any active group ("open" or "draw completed") can be archived by the owner.
- Q: Who can view and share the invite link/card? → A: All group members (not just the owner) can view and share the invite link and virtual invite card.
- Q: Minimum members required to trigger the draw? → A: At least 3 members. The draw button is visible but disabled when the group has fewer than 3 members, accompanied by a friendly inline message explaining the requirement.
- Q: Should the draw button be hidden or disabled when the minimum is not met? → A: Disabled (visible but locked) with a friendly message — best UX practice so users understand the action exists and know what to do to unlock it.
- Q: Does the groups list require pagination support? → A: Yes. The backend already paginates the groups list; the frontend must support paginated loading.
- Q: What pagination UX pattern for the groups list? → A: "Load more" button — the user explicitly triggers loading the next page; no infinite scroll or numbered pagination.

### Session 2026-03-29

- Q: What is the frontend route structure for the invite link page? → A: `/invite/[token]` — a dedicated public root-level route.
- Q: What UI feedback pattern should be used when any group management API call fails (network error, 5xx)? → A: Global error toast for all API failures.
- Q: What happens when a logged-in non-member navigates directly to a group detail URL? → A: Redirect to `/dashboard` with an error toast ("Grupo não encontrado ou sem acesso").
- Q: Which reveal animation should be used for the draw result? → A: Animated CSS 3D card flip.
- Q: What is the fallback when the Web Share API is not supported by the browser? → A: Copy the invite link to clipboard and show a confirmation toast (same behaviour as FR-006).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - List and Create Groups (Priority: P1)

A logged-in user lands on the groups dashboard and sees all their groups. From here, they can start a new secret santa group by providing a name and optional description. After creation, the group appears at the top of the list with a "waiting for members" status.

**Why this priority**: Without the ability to list and create groups, no other group management feature is reachable. This is the entry point for the entire feature.

**Independent Test**: Can be fully tested by logging in and navigating to the groups page, then creating a group — delivers a usable group list with real data.

**Acceptance Scenarios**:

1. **Given** a logged-in user with no groups, **When** they visit the groups page, **Then** they see an empty state encouraging them to create their first group.
2. **Given** a logged-in user, **When** they fill in the group name and submit the create form, **Then** a new group is created and appears at the top of the group list with status "open".
3. **Given** a logged-in user with existing groups, **When** they visit the groups page, **Then** all their groups are listed showing name, member count, and current status.
4. **Given** a logged-in user, **When** they submit the create form with an empty name, **Then** an inline validation message prevents submission.

---

### User Story 2 - Invite Members via Card and Link (Priority: P2)

Any group member can view the shareable invite link and virtual invite card for their group. The card displays the group name, owner name, and a visual design. Both the link and the card can be shared via social media or copied to clipboard, allowing new people to join without the owner manually adding them.

**Why this priority**: Invitation is the primary growth mechanism for groups. Without a frictionless way to invite, groups cannot grow organically.

**Independent Test**: Can be fully tested by any member navigating to the invite section — delivers a shareable link and card that a new user can use to join.

**Acceptance Scenarios**:

1. **Given** any member on the group detail page of an open group, **When** they open the invite section, **Then** they see the group's unique invite link and a visually styled virtual invite card.
2. **Given** any member viewing the invite card, **When** they click "copy link", **Then** the invite URL is copied to the clipboard and a confirmation toast appears.
3. **Given** any member viewing the invite card, **When** they click a share button (e.g., WhatsApp), **Then** the native share or a pre-filled message opens with the invite link.
4. **Given** a user who receives an invite link, **When** they open it while logged in and the group is open, **Then** they are automatically added to the group and redirected to the group detail page.
5. **Given** a user who receives an invite link, **When** they open it while not logged in, **Then** they are redirected to login/register and then joined to the group after authentication.
6. **Given** a user who receives an invite link to a group with status "draw completed", **When** they visit the link, **Then** they see a message explaining the draw has been completed and new members cannot join until the owner reopens the group.

---

### User Story 3 - View Group Details and Manage Members (Priority: P3)

A group owner can view the full group detail page, which lists all current members with their status. The owner can remove a member before the draw is completed. Any member can see the group details but cannot manage other members.

**Why this priority**: Group detail visibility and member management are required before the draw can happen, but they deliver value independently by giving the owner oversight of their group.

**Independent Test**: Can be tested by opening a group with members and verifying the member list and removing a member before draw.

**Acceptance Scenarios**:

1. **Given** a group owner on the group detail page, **When** they view the members section, **Then** they see a list of all members with their name and join status.
2. **Given** a group owner, **When** they click "remove member" on a member before the draw is completed, **Then** the member is removed and the list updates immediately.
3. **Given** a group member (non-owner), **When** they view the group detail page, **Then** they can see the member list but do not see remove/manage controls.
4. **Given** a group owner, **When** they try to remove a member after a draw has been completed, **Then** the remove option is disabled and an explanation is shown.

---

### User Story 4 - Draw Names (Priority: P4)

A group owner can trigger the secret santa draw when the group has at least three members. Each member is randomly assigned exactly one other member as their gift recipient. After the draw, the group status changes to "draw completed", no new members can join, and each member can see only their own assigned recipient.

**Why this priority**: The draw is the core value proposition of the product. All prior stories build up to this moment.

**Independent Test**: Can be fully tested by having a group with 3+ members and triggering the draw — delivers individual recipient assignments visible to each member.

**Acceptance Scenarios**:

1. **Given** a group with 3 or more members, **When** the owner clicks "draw names", **Then** each member receives a unique recipient assignment and the group status changes to "draw completed".
2. **Given** a group with fewer than 3 members, **When** the owner views the group detail, **Then** the draw button is visible but disabled, accompanied by a friendly inline message explaining that at least 3 members are needed.
3. **Given** a group where the draw has already been completed, **When** any member views the group detail, **Then** the draw button is replaced with the group result state and the invite section is hidden.
4. **Given** a draw is triggered successfully, **When** a member views the group, **Then** they see a prompt/button to reveal their recipient.

---

### User Story 5 - View Draw Result (Priority: P5)

After the draw, each member can view their personal result — who they are giving a gift to. The reveal is presented as an animated CSS 3D card flip: the front face shows a mystery/placeholder side, and flipping reveals the recipient's name on the back. The result is only visible to the individual member and is not shared with others.

**Why this priority**: The result reveal is the climactic user experience of the product. It depends on the draw (P4) having been completed.

**Independent Test**: Can be fully tested after a draw — log in as a member and open the result page to verify only your own recipient is shown.

**Acceptance Scenarios**:

1. **Given** a member after a draw, **When** they click "see who you give a gift to", **Then** an animated reveal shows the name of their assigned recipient.
2. **Given** a member viewing their result, **Then** they can only see their own recipient — no other assignments are visible.
3. **Given** a member who revisits the result after the initial reveal, **When** they return to the group page, **Then** their recipient is displayed without requiring another reveal animation.

---

### User Story 6 - Reopen Group After Draw (Priority: P6)

A group owner can reopen a group that has already had a draw completed. Reopening clears all draw results so that new members can join and a new draw can be performed. The group returns to "open" status.

**Why this priority**: Reopening supports scenarios where someone was missed in the original draw or the group wants to redo the draw with different members.

**Independent Test**: Can be fully tested on a group with "draw completed" status — reopen it, confirm status returns to "open", confirm draw results are gone, and confirm new members can join via the invite link.

**Acceptance Scenarios**:

1. **Given** a group owner on a group with "draw completed" status, **When** they click "reopen group" and confirm, **Then** all draw results are cleared and the group returns to "open" status.
2. **Given** a group that has been reopened, **When** a user visits the invite link, **Then** they can join the group normally.
3. **Given** a non-owner member, **When** they view the group detail page, **Then** they do not see the reopen control.
4. **Given** a group in "open" status (no draw yet), **When** the owner views the group, **Then** the reopen option is not available.

---

### User Story 7 - Archive Group (Priority: P7)

A group owner can permanently archive a group, removing it from the active list. Archiving is irreversible — archived groups cannot be restored. Archived groups are hidden from the main groups list.

**Why this priority**: Archiving keeps the groups dashboard clean by permanently retiring old or unwanted groups.

**Independent Test**: Can be fully tested by archiving a group and confirming it disappears from the active list permanently, with no option to restore it.

**Acceptance Scenarios**:

1. **Given** a group owner, **When** they click "archive group" and confirm, **Then** the group is permanently archived and disappears from the active groups list.
2. **Given** an archived group, **Then** there is no "unarchive" or "restore" option available anywhere in the interface.
3. **Given** a non-owner member, **When** they view the group detail page, **Then** they do not see the archive control.
4. **Given** a user who visits an invite link to an archived group, **When** they open it, **Then** they see a message that the group is no longer active.

---

### Non-Functional / Quality Attributes

- **Error Handling**: All API call failures (network error, 5xx backend response) across all group management operations MUST display a global error toast. The toast MUST be dismissed automatically or by user interaction and MUST NOT block the current page content.

### Edge Cases

- What happens when fewer than 3 members are in the group and the owner interacts with the disabled draw button?
- How does the system handle a user joining a group they are already a member of via invite link?
- What happens if the owner tries to draw names in a group that already has a completed draw?
- How does the system handle invite links for groups with "draw completed" status (new members blocked)?
- How does the system handle invite links for archived groups (group no longer active)?
- How does the system handle very long group names or member names in the invite card layout?
- What happens to the members list when a group is reopened after a draw?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display active (non-archived) groups belonging to the logged-in user on the groups dashboard, showing name, member count, and status. The list MUST support a "load more" button pattern to fetch additional pages from the backend's paginated API, and MUST hide the button when no more pages are available.
- **FR-002**: System MUST allow the group owner to create a new group by providing a name (required) and optional description.
- **FR-003**: System MUST provide a group detail page showing members list, group status, and available actions for the current user's role (owner vs. member). If the logged-in user is not a member of the requested group (API returns 403/404), the system MUST redirect them to `/dashboard` and display an error toast ("Grupo não encontrado ou sem acesso").
- **FR-004**: System MUST generate a unique, shareable invite link for each group, visible to all group members.
- **FR-005**: System MUST display a visually styled virtual invite card showing the group name and owner name, visible to all group members.
- **FR-006**: System MUST allow any group member to copy the invite link to the clipboard with a confirmation feedback.
- **FR-007**: System MUST support native sharing of the invite link (Web Share API) for any group member on supported devices. When the Web Share API is unavailable (e.g., desktop browsers), the system MUST fall back to copying the invite link to the clipboard and displaying a confirmation toast (identical to FR-006 behaviour).
- **FR-008**: System MUST automatically add a logged-in user to an open group when they visit a valid invite link at the route `/invite/[token]`.
- **FR-009**: System MUST redirect unauthenticated users who visit `/invite/[token]` to login/register, then return them to complete the join flow after authentication.
- **FR-010**: System MUST block joining via invite link when the group status is "draw completed", showing a message that the owner must reopen the group first.
- **FR-011**: System MUST block joining via invite link when the group is archived, showing a message that the group is no longer active.
- **FR-012**: System MUST allow the group owner to remove a member before the draw is completed.
- **FR-013**: System MUST prevent member removal after a draw has been completed, showing an explanation to the owner.
- **FR-014**: System MUST allow the group owner to trigger the draw only when the group has 3 or more members and status is "open". When fewer than 3 members are present, the draw button MUST remain visible but disabled, with a friendly inline message explaining the minimum requirement.
- **FR-015**: System MUST assign each member exactly one unique recipient during the draw, with no self-assignments.
- **FR-016**: System MUST change the group status to "draw completed" after a successful draw.
- **FR-017**: System MUST hide the invite section on the group detail page when the group status is "draw completed" or "archived".
- **FR-018**: System MUST allow each member to reveal their assigned recipient through an animated CSS 3D card flip interaction (front face shows a placeholder/mystery side; back face reveals the recipient's name).
- **FR-019**: System MUST show each member only their own recipient — no member can see another's assignment.
- **FR-020**: System MUST allow the group owner to reopen a group with "draw completed" status, clearing all draw results and returning the group to "open" status.
- **FR-021**: System MUST allow the group owner to permanently archive a group; this action is irreversible and the group cannot be restored.
- **FR-022**: System MUST display a visually engaging empty state on the groups dashboard when the user has no active groups.
- **FR-023**: System MUST be fully responsive and usable on smartphones, tablets, and desktops.
- **FR-024**: System MUST provide smooth transitions and animations consistent with the project style guide throughout all group management flows.

### Key Entities

- **Group**: Represents a secret santa circle — has a name, optional description, owner, status (open / draw completed / archived), and creation date. Status transitions: open → draw completed (after draw); draw completed → open (reopen); open or draw completed → archived (permanent).
- **Member**: A user who belongs to a group — has join status and an optional recipient assignment after the draw. Assignments are cleared when the group is reopened.
- **Invite**: A unique token/link tied to a group — exposed at the frontend route `/invite/[token]`; valid only when group status is "open"; blocked for "draw completed" and "archived" groups.
- **Draw Result**: A private mapping of member → recipient produced after the draw — visible only to the assigned member; cleared when the group is reopened.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A logged-in user can view the first page of their active groups within 2 seconds of navigating to the groups dashboard; each subsequent "load more" action completes within 2 seconds.
- **SC-002**: A group owner can complete the group creation flow in under 60 seconds from clicking "new group" to seeing the group in the list.
- **SC-003**: A group owner can generate and share an invite link in under 30 seconds from the group detail page.
- **SC-004**: A user receiving an invite link can join a group and land on the group detail page in under 3 clicks/taps.
- **SC-005**: The secret santa draw completes and all members can access their result within 5 seconds of the owner triggering it.
- **SC-006**: 90% of first-time users can complete the primary flow (create group → invite member → draw → view result) without external help.
- **SC-007**: All group management screens are fully functional on viewport widths from 320px (mobile) to 1440px (desktop).
- **SC-008**: All animated transitions complete within 400ms and do not cause layout shifts.

## Assumptions

- The backend API already exposes all required endpoints for group CRUD, member management, draw logic, and invite tokens. Frontend only consumes these endpoints.
- Invite links use a unique token format that the backend validates — the frontend does not generate tokens.
- The draw assignment algorithm runs server-side; the frontend only triggers the draw and displays results.
- A "group owner" is the user who created the group. Ownership cannot be transferred (not in scope).
- Group member self-assignment is prevented server-side; the frontend only needs to handle success/error responses.
- Adding members manually by typing a name/email is out of scope — the only onboarding path for new members is the invite link.
- Notification emails or push notifications when assigned a recipient are out of scope for this feature.
- The backend paginates the groups list; the frontend must consume the paginated API and support loading additional pages. Pagination applies to groups only — member lists within a group are not paginated.
- When a group is reopened, existing members remain in the group — only draw results are cleared.
- Archiving is available from both "open" and "draw completed" states (any active group can be archived).

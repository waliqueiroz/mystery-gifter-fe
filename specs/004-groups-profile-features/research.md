# Research: Groups & Profile Enhancements

**Feature**: `004-groups-profile-features`  
**Date**: 2026-06-16

## Decision Log

### 1. Member count terminology: "participante" vs "membro"

- **Decision**: Keep "participante / participantes" — do not change to "membro / membros".
- **Rationale**: `GroupCard` already renders `user_count` as "X participante(s)". `MemberList` uses the heading "Participantes (N)". Changing the noun would break existing tests and create inconsistency within the same feature's components. FR-002's wording ("membro") was illustrative, not prescriptive. "Participante" is the canonical term throughout the application.
- **Alternatives considered**: Rename to "membro/membros" across all components — rejected because it requires touching `MemberList`, its tests, and existing `GroupCard` tests with no UX improvement.

---

### 2. Profile page data source: session vs fresh API call

- **Decision**: Display data from the authenticated session (`useUser()`) — no API call on profile page load.
- **Rationale**: `UserContext` stores the full `User` object from login (includes `id`, `name`, `surname`, `email`, `created_at`, `updated_at`). Since there is no PUT /users endpoint, the session data is always authoritative. Reading from session avoids a `useEffect` + API call, eliminates a network round trip, and keeps `ProfileCard` a simple presentational component — avoiding the constitution violation flagged for `MemberProfileModal`.
- **Alternatives considered**: Call `GET /api/v1/users/{id}` on mount — rejected because it adds a network dependency to a purely read-only page without adding any freshness benefit (data cannot change while the user is logged in).

---

### 3. "Load More" error handling vs filter-change error handling

- **Decision**: Inline error (replaces list + retry button) for initial load and filter/sort changes. Toast-only for "Load More" failures (pagination appends to existing list).
- **Rationale**: FR-016b says "display an error message in place of the list" for fetch failures. Replacing an already-loaded list with an error state when only the "load more" request fails would be disruptive — the user already has useful content. For "load more", a toast indicating partial load failure is sufficient and non-destructive.
- **Alternatives considered**: Replace list on all errors — rejected because losing visible content on a "load more" failure is poor UX.

---

### 4. Owner badge implementation in GroupCard

- **Decision**: Add `currentUserId?: string` prop to `GroupCard`. `GroupList` passes `user?.id` down.
- **Rationale**: `GroupCard` is a presentational component; injecting `useUser()` inside it would add an implicit dependency on `UserContext` and make the component harder to test in isolation. Passing `currentUserId` as a prop keeps the component pure and testable with mock data.
- **Alternatives considered**: Use `useUser()` inside `GroupCard` — rejected for the testing/coupling reasons above.

---

### 5. GroupFilters state ownership

- **Decision**: `GroupList` owns all filter state (`name`, `statuses`, `sortDirection`). `GroupFilters` is a controlled component that receives current values and an `onChange` callback.
- **Rationale**: `GroupList` is responsible for fetching data; co-locating filter state with the fetch logic avoids prop-drilling a shared setter and keeps the data flow unidirectional.
- **Alternatives considered**: `GroupFilters` owns its own state and calls a callback on submit — rejected because it introduces an extra "submit" step inconsistent with the reactive behaviour required by the spec.

---

### 6. Empty status selection behaviour

- **Decision**: When `statuses` array is empty, omit all `status=` query parameters from the request. The backend then returns all groups regardless of status.
- **Rationale**: Confirmed by the user: "O comportamento padrão do backend é trazer tudo se nada for selecionado pra filtrar." This is also simpler than blocking empty selection in the UI.
- **Implementation note**: In `listGroups`, iterate `statuses.forEach(s => params.append('status', s))`. If `statuses.length === 0`, nothing is appended — the backend interprets absence of `status` as "all statuses".

---

### 7. listGroups param extension strategy

- **Decision**: Extend `ListGroupsParams` with optional `name`, `statuses`, `sortDirection` fields. Defaults match today's hardcoded behaviour: `statuses = ['OPEN', 'MATCHED']`, `sortDirection = 'DESC'`.
- **Rationale**: Backwards-compatible extension — all existing callers (pagination "load more", group created handler) continue to work without changes. Only `GroupList` needs to pass the new params.
- **Backend param names confirmed**:
  - Name filter: `name` (string)
  - Status filter: `status` (repeatable, e.g. `status=OPEN&status=MATCHED`)
  - Sort field: `sort_by=created_at` (only `created_at` in scope)
  - Sort direction: `sort_direction=ASC|DESC`

---

### 8. MemberProfileModal data fetching

- **Decision**: Fetch `GET /api/v1/users/{id}` inside `MemberProfileModal` when `isOpen` transitions to `true`. Reset `user`, `loading`, and `error` state when `userId` changes.
- **Rationale**: On-demand fetch minimises network traffic (only fired on click). Using the `isOpen + userId` pair as the `useEffect` dependency ensures each new modal open for a different member re-fetches correctly.
- **Constitution justification**: This is the only `useEffect`-for-data-fetching in this feature; it is justified because the fetch is triggered by a user interaction (click), not by component mount, making a Server Component pattern inapplicable.

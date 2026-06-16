# Data Model: Groups & Profile Enhancements

**Feature**: `004-groups-profile-features`  
**Date**: 2026-06-16

## Existing Types (unchanged)

### `User` — `src/types/api.ts`

```typescript
interface User {
  id: string
  name: string
  surname: string
  email: string
  created_at: string   // ISO 8601 timestamp — rendered as localised date on profile page
  updated_at: string
}
```

Source: `GET /api/v1/users/{id}` response and `POST /api/v1/login` session payload.

---

### `GroupSummary` — `src/types/api.ts`

```typescript
interface GroupSummary {
  id: string
  name: string
  status: GroupStatus        // 'OPEN' | 'MATCHED' | 'ARCHIVED'
  owner_id: string           // used by GroupCard owner badge
  user_count: number         // already rendered as "X participante(s)"
  created_at: string
  updated_at: string
}
```

All fields required by this feature (`owner_id`, `user_count`) are already present. No changes needed.

---

### `GroupStatus` — `src/types/api.ts`

```typescript
type GroupStatus = 'OPEN' | 'MATCHED' | 'ARCHIVED'
```

Canonical values confirmed against backend enum. Used verbatim in API query params.

---

### `GroupSearchResult` — `src/types/api.ts`

```typescript
interface GroupSearchResult {
  result: GroupSummary[]
  paging: Paging
}

interface Paging {
  limit: number
  offset: number
  total: number
}
```

No changes needed.

---

## New Types

### `GroupFilterParams` — add to `src/types/api.ts`

Represents the active filter/sort state that `GroupList` holds and passes to `listGroups`.

```typescript
interface GroupFilterParams {
  name: string                 // empty string = no name filter
  statuses: GroupStatus[]      // empty array = no status filter (backend returns all)
  sortDirection: 'ASC' | 'DESC'
}
```

**Default value** (matches today's hardcoded behaviour):

```typescript
const DEFAULT_GROUP_FILTERS: GroupFilterParams = {
  name: '',
  statuses: ['OPEN', 'MATCHED'],
  sortDirection: 'DESC',
}
```

---

## Updated Service Interface

### `ListGroupsParams` — `src/services/api/groupService.ts`

Extended with optional filter fields. Defaults preserve backwards compatibility.

```typescript
interface ListGroupsParams {
  userId: string
  offset?: number                    // default: 0
  limit?: number                     // default: 15
  name?: string                      // default: '' (omitted from params)
  statuses?: GroupStatus[]           // default: ['OPEN', 'MATCHED']
  sortDirection?: 'ASC' | 'DESC'     // default: 'DESC'
}
```

**Mapping to query params** (sort field is always `created_at`):

| JS field | API param | Notes |
|----------|-----------|-------|
| `name` | `name` | Omitted when empty string |
| `statuses[i]` | `status` (repeated) | Omitted entirely when array is empty → backend returns all |
| `sortDirection` | `sort_direction` | Always sent |
| — | `sort_by` | Always `created_at` (hardcoded — only sort field in scope) |

---

## Component Prop Interfaces

### `GroupCard` — modified

```typescript
interface GroupCardProps {
  group: GroupSummary
  currentUserId?: string   // NEW — if matches group.owner_id, shows owner badge
}
```

### `GroupFilters` — new

```typescript
interface GroupFiltersProps {
  filters: GroupFilterParams
  onChange: (filters: GroupFilterParams) => void
}
```

### `MemberProfileModal` — new

```typescript
interface MemberProfileModalProps {
  userId: string | null    // null = modal should not be shown
  onClose: () => void
}
```

`isOpen` is derived as `userId !== null` inside the component.

### `ProfileCard` — new

No props — reads current user directly from `useUser()` context.

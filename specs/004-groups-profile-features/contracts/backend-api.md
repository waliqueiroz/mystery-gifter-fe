# Backend API Contracts

**Feature**: `004-groups-profile-features`  
**Base URL (dev)**: proxied via Next.js rewrites → `/api/v1/*` → `http://localhost:8080/api/v1/*`  
**Auth**: All endpoints require `Authorization: Bearer <token>` header.

---

## GET /api/v1/groups

Returns a paginated list of group summaries matching the given filters.

### Query Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `user_id` | string (UUID) | Yes | Returns only groups the user belongs to |
| `name` | string | No | Case-insensitive partial match on group name |
| `status` | string (repeatable) | No | Filter by status; repeat for multiple values. Omit entirely to get all statuses. Valid: `OPEN`, `MATCHED`, `ARCHIVED` |
| `sort_by` | string | No | Field to sort by. In scope: `created_at` only |
| `sort_direction` | string | No | `ASC` or `DESC` (uppercase) |
| `limit` | integer | No | Page size (default: 15) |
| `offset` | integer | No | Pagination offset (default: 0) |

**Example — filtered request:**

```
GET /api/v1/groups?user_id=abc&status=OPEN&status=ARCHIVED&name=natal&sort_by=created_at&sort_direction=DESC&limit=15&offset=0
```

**Example — no status filter (returns all):**

```
GET /api/v1/groups?user_id=abc&sort_by=created_at&sort_direction=DESC&limit=15&offset=0
```

### Response `200 OK`

```json
{
  "result": [
    {
      "id": "01234567-89ab-cdef-0123-456789abcdef",
      "name": "Amigo Secreto 2024",
      "description": "Troca de presentes do escritório",
      "status": "OPEN",
      "owner_id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
      "user_count": 5,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "paging": {
    "total": 42,
    "limit": 15,
    "offset": 0
  }
}
```

**Key fields for this feature:**

| Field | Used by |
|-------|---------|
| `owner_id` | `GroupCard` — compared against current user ID to show owner badge |
| `user_count` | `GroupCard` — already rendered as "X participante(s)" |
| `status` | `GroupCard` / `GroupStatusBadge`; visual distinction for ARCHIVED groups |

---

## GET /api/v1/users/{userID}

Returns a single user's profile data.

### Path Parameter

| Parameter | Type | Notes |
|-----------|------|-------|
| `userID` | string (UUID) | ID of the user to fetch |

### Response `200 OK`

```json
{
  "id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  "name": "João",
  "surname": "Silva",
  "email": "joao.silva@example.com",
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T10:00:00Z"
}
```

**Usage in this feature:**

| Consumer | Purpose |
|----------|---------|
| `MemberProfileModal` | Fetch member data on click in `MemberList` |
| `ProfileCard` | **Not used** — reads session data via `useUser()` instead |

### Error responses

| Status | Condition |
|--------|-----------|
| `401 Unauthorized` | Missing or expired token → `clearToken()` + redirect to `/login` |
| `404 Not Found` | User ID does not exist |
| `500 Internal Server Error` | Backend error |

Handled by the shared `apiFetch` helper in `groupService.ts` (same pattern to be reused in `userService.ts`).

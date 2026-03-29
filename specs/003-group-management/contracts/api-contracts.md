# API Contracts: Secret Santa Group Management

**Branch**: `003-group-management` | **Date**: 2026-03-29
**Base URL** (via Next.js rewrite proxy): `/api/v1`
**Auth**: All endpoints require `Authorization: Bearer <token>` except where noted.

---

## Authentication header helper (all calls)

```typescript
function authHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}
```

---

## Groups

### List groups for the current user

```
GET /api/v1/groups
  ?user_id={currentUserId}
  &limit=15
  &offset={offset}
  &sort_by=created_at
  &sort_direction=DESC
```

**Response 200**: `GroupSearchResult`

```json
{
  "result": [GroupSummary, ...],
  "paging": { "limit": 15, "offset": 0, "total": 42 }
}
```

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Token invalid/expired | Clear session → redirect `/login` |
| 400/422 | Bad query params | Error toast |

**Pagination logic**:
- Show "Load More" when `paging.offset + paging.limit < paging.total`
- On "Load More": `offset += limit`, append results
- Filter out `status === 'ARCHIVED'` from results client-side before rendering

---

### Create group

```
POST /api/v1/groups
Body: { "name": "string", "description"?: "string" }
```

**Response 201**: `Group`

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 400/422 | Validation failed | Inline form error |
| 401 | Unauthenticated | Clear session → redirect `/login` |

---

### Get group detail

```
GET /api/v1/groups/{groupId}
```

**Response 200**: `Group`

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Clear session → redirect `/login` |
| 403 | Not a group member (pending BC-003) | Error toast → redirect `/groups` |
| 404 | Group not found | Error toast → redirect `/groups` |

---

### Remove member

```
DELETE /api/v1/groups/{groupId}/users/{userId}
```

**Response 200**: `Group` (updated)

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Clear session → redirect `/login` |
| 403 | Not owner | Error toast |
| 404 | Group or user not found | Error toast |
| 409 | Group not OPEN | Error toast |

---

### Trigger draw

```
POST /api/v1/groups/{groupId}/matches
```

**Response 200**: `Group` (status now `MATCHED`)

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Clear session → redirect `/login` |
| 403 | Not owner | Error toast |
| 404 | Group not found | Error toast |
| 409 | Group not OPEN or < 3 members | Error toast |

---

### Get current user's match (result reveal)

```
GET /api/v1/groups/{groupId}/matches/user
```

**Response 200**: `User` (the recipient)

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Clear session → redirect `/login` |
| 403 | Not a member | Error toast |
| 404 | No match found / group not matched | Error toast |

---

### Reopen group

```
POST /api/v1/groups/{groupId}/reopen
```

**Response 200**: `Group` (status back to `OPEN`, `matches: []`)

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Clear session → redirect `/login` |
| 403 | Not owner | Error toast |
| 404 | Group not found | Error toast |
| 409 | Group not MATCHED (already OPEN or ARCHIVED) | Error toast |

---

### Archive group

```
POST /api/v1/groups/{groupId}/archive
```

**Response 200**: `Group` (status `ARCHIVED`)

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Clear session → redirect `/login` |
| 403 | Not owner | Error toast |
| 404 | Group not found | Error toast |
| 409 | Group already ARCHIVED | Error toast |

---

## Invites

### Create invite link (owner only)

```
POST /api/v1/groups/{groupId}/invites
```

**Response 201**: `GroupInvite`

```json
{
  "id": "uuid",
  "group_id": "uuid",
  "expires_at": "ISO8601",
  "created_at": "ISO8601"
}
```

**Share URL construction** (frontend):
```typescript
const shareUrl = `${window.location.origin}/invite/${invite.id}`
```

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Clear session → redirect `/login` |
| 403 | Not owner | Error toast |
| 404 | Group not found | Error toast |
| 409 | Group not OPEN | Error toast |

---

### Get active invite (any member) — Pending BC-002

```
GET /api/v1/groups/{groupId}/invites/active
```

**Response 200**: `GroupInvite`
**Response 404**: No active invite exists

**Frontend behaviour on 404**: Show message "Peça ao dono do grupo para gerar o link de convite."

> ⚠️ This endpoint does not yet exist. Until BC-002 is merged, only the owner
> can see/share the invite (by calling `POST /api/v1/groups/{groupId}/invites`).
> Non-owner members see a placeholder message.

---

### Join group via invite

```
POST /api/v1/invites/{inviteToken}/join
```

**Response 200**: `Group` (the joined group)

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Store returnUrl → redirect `/login` |
| 404 | Invite not found | Show "Link inválido ou expirado" message |
| 409 | Invite expired or group not OPEN | Show contextual message (expired vs. draw completed) |

---

## Error response shape

All error responses follow this shape:

```typescript
interface ApiError {
  code: string     // e.g. "bad_request", "forbidden", "conflict"
  message: string  // English; frontend maps to pt-BR
  details?: unknown
}
```

The frontend service layer catches all non-2xx responses, reads this body, and triggers the `useToast()` error toast with a pt-BR message.

---

## HTTP client pattern (all services)

```typescript
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { ...authHeaders(), ...init?.headers },
  })

  if (response.status === 401) {
    clearToken()
    clearUser()
    // Redirect handled by the calling component or AuthGuard
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message ?? 'Ocorreu um erro. Tente novamente.')
  }

  return response.json() as Promise<T>
}
```

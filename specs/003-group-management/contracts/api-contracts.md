# API Contracts: Secret Santa Group Management

**Branch**: `003-group-management` | **Date**: 2026-03-29 (v2 — all backend gaps resolved)
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
    throw new Error('Sessão expirada. Faça login novamente.')
  }

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message ?? 'Ocorreu um erro. Tente novamente.')
  }

  return response.json() as Promise<T>
}
```

All service functions use `apiFetch`. The calling component catches thrown errors and passes the message to `useToast().showToast({ message, type: 'error' })`.

---

## Groups

### List groups for the current user

```
GET /api/v1/groups
  ?user_id={currentUserId}
  &status=OPEN
  &status=MATCHED
  &limit=15
  &offset={offset}
  &sort_by=created_at
  &sort_direction=DESC
```

The `status` parameter accepts multiple values via repeated query params (`collectionFormat: multi`). Sending `OPEN` + `MATCHED` returns only active (non-archived) groups — no client-side filtering needed.

**Response 200**: `GroupSearchResult`

```json
{
  "result": [GroupSummary, ...],
  "paging": { "limit": 15, "offset": 0, "total": 42 }
}
```

**Pagination logic**:
- Show "Carregar mais" button when `paging.offset + paging.limit < paging.total`
- On click: `offset += limit`, append results to list

**Error responses**:
| Status | Frontend action |
|--------|----------------|
| 401 | Clear session → redirect `/login` |
| 400/422 | Error toast |

---

### Create group

```
POST /api/v1/groups
Body: { "name": "string", "description"?: "string" }
```

**Response 201**: `Group`

**Error responses**:
| Status | Frontend action |
|--------|----------------|
| 400/422 | Inline form error in `CreateGroupModal` |
| 401 | Clear session → redirect `/login` |

---

### Get group detail

```
GET /api/v1/groups/{groupId}
```

**Response 200**: `Group`

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Token invalid | Clear session → redirect `/login` |
| 403 | Not a group member | Error toast → redirect `/groups` |
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
| 409 | Group is not MATCHED (already OPEN or ARCHIVED) | Error toast |

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

### Get active invite (any group member)

```
GET /api/v1/groups/{groupId}/invites/active
```

**Response 200**: `GroupInvite`

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

**Response 404**: No active invite exists.

**Frontend behaviour by role**:
- **Owner on 404**: show "Gerar link de convite" button → calls `POST` below
- **Non-owner on 404**: show "Peça ao dono para gerar o link de convite."
- **200 (any member)**: render invite card with copy and share buttons

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Clear session → redirect `/login` |
| 403 | Not a group member | Error toast |
| 404 | No active invite | See role-based behavior above |

---

### Create invite link (owner only)

```
POST /api/v1/groups/{groupId}/invites
```

**Response 201**: `GroupInvite` — frontend immediately renders the invite card.

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Clear session → redirect `/login` |
| 403 | Not owner | Error toast |
| 404 | Group not found | Error toast |
| 409 | Group not OPEN | Error toast |

---

### Join group via invite

```
POST /api/v1/invites/{inviteToken}/join
```

**Response 200**: `Group` (the joined group) → redirect to `/groups/{group.id}`

**Error responses**:
| Status | Trigger | Frontend action |
|--------|---------|----------------|
| 401 | Unauthenticated | Store returnUrl → redirect `/login` |
| 404 | Invite not found | Show "Link inválido ou expirado." |
| 409 | Invite expired or group not OPEN | Show contextual message |

---

## Error response shape

```typescript
interface ApiError {
  code: string     // e.g. "bad_request", "forbidden", "conflict"
  message: string  // English from backend; frontend maps to pt-BR
  details?: unknown
}
```

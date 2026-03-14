# Data Model: Mystery Gifter — Initial Screens

**Feature**: 001-initial-screens
**Date**: 2026-03-08
**Source**: Backend swagger.yaml + spec clarifications

---

## Frontend TypeScript Types

### API Response Types

```typescript
// src/types/api.ts

/** Returned by POST /api/v1/login on success */
export interface AuthSession {
  user: User
  access_token: string   // JWT Bearer token — stored in localStorage
  token_type: 'Bearer'
  expires_in: number     // seconds
}

/** Returned by POST /api/v1/users on success (201) */
export interface User {
  id: string
  name: string           // first name
  surname: string        // last name
  email: string
  created_at: string     // RFC3339
  updated_at: string     // RFC3339
}

/** Returned by the API on error */
export interface ApiError {
  code: string           // e.g. "bad_request", "conflict"
  message: string
  details?: unknown
}
```

### API Request Types

```typescript
// src/types/api.ts (continued)

/** Body for POST /api/v1/login */
export interface LoginCredentials {
  email: string
  password: string
}

/** Body for POST /api/v1/users */
export interface CreateUserPayload {
  name: string
  surname: string
  email: string
  password: string          // min 8 characters (validated client-side)
  password_confirm: string  // must match password (validated client-side)
}
```

### Form State Types

```typescript
// src/types/forms.ts

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  surname: string
  email: string
  password: string
  passwordConfirm: string
}
```

### Client-Side Session State

```typescript
// src/lib/auth.ts

/** Key used to store the JWT in localStorage */
export const TOKEN_KEY = 'mystery_gifter_token'

/** Retrieves the JWT from localStorage; returns null if not present */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

/** Stores the JWT in localStorage */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/** Removes the JWT from localStorage (logout) */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/** Returns true if a JWT is present in localStorage */
export function isAuthenticated(): boolean {
  return !!getToken()
}
```

---

## Entity Relationships (frontend perspective)

```
localStorage
  └── mystery_gifter_token  ──► JWT (access_token from AuthSession)

AuthSession
  ├── access_token           ──► stored in localStorage
  ├── token_type             ──► always "Bearer"
  ├── expires_in             ──► informational; expiry enforced by backend (401 response)
  └── user: User             ──► NOT persisted; re-fetched if needed

User
  ├── id                     ──► UUID
  ├── name + surname         ──► display name
  ├── email                  ──► unique identifier
  ├── created_at             ──► ISO timestamp
  └── updated_at             ──► ISO timestamp
```

---

## Validation Rules (client-side, matching backend constraints)

| Field | Rule | Source |
|-------|------|--------|
| email | Non-empty, valid email format | Frontend + Backend |
| password (login) | Non-empty | Frontend |
| name | Non-empty | Frontend + Backend (required) |
| surname | Non-empty | Frontend + Backend (required) |
| password (register) | Non-empty, min 8 characters | Frontend (backend: minLength: 8) |
| password_confirm | Non-empty, must equal password | Frontend only |

---

## State Transitions

```
[Unauthenticated]
     │
     ├─► POST /api/v1/users (register)
     │       │
     │       ▼ 201 UserDTO
     │   POST /api/v1/login (auto-login)
     │       │
     │       ▼ 200 AuthSession
     │   localStorage.setItem(TOKEN_KEY, access_token)
     │       │
     │       ▼
[Authenticated] ──► /dashboard
     │
     ├─► User clicks logout
     │       │
     │       ▼
     │   localStorage.removeItem(TOKEN_KEY)
     │       │
     │       ▼
[Unauthenticated] ──► /login
     │
     └─► Backend returns 401
             │
             ▼
         localStorage.removeItem(TOKEN_KEY)
             │
             ▼
     [Unauthenticated] ──► /login
```

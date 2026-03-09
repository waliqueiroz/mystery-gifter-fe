# API Contracts: Mystery Gifter — Initial Screens

**Feature**: 001-initial-screens
**Date**: 2026-03-08
**Backend base URL**: `http://localhost:8080` (dev) / `NEXT_PUBLIC_API_URL` (prod)
**Frontend proxy prefix**: `/api/v1/*` → `{NEXT_PUBLIC_API_URL}/api/v1/*`

All requests and responses use `Content-Type: application/json`.
Authenticated endpoints require `Authorization: Bearer {access_token}` header.

---

## AUTH-01: Login

**Direction**: Frontend → Backend
**Endpoint**: `POST /api/v1/login`
**Used in**: User Story 3 (Login screen)

### Request

```
POST /api/v1/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret1234"
}
```

### Responses

| Status | Body | Frontend action |
|--------|------|-----------------|
| 200 | `AuthSession` | Store `access_token` in localStorage → redirect `/dashboard` |
| 400 | `WebError` | Show generic error message |
| 401 | `WebError` | Show "E-mail ou senha inválidos" |
| 422 | `WebError` | Show validation error from `message` field |

### AuthSession shape

```json
{
  "user": {
    "id": "01234567-89ab-cdef-0123-456789abcdef",
    "name": "João",
    "surname": "Silva",
    "email": "joao@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

## AUTH-02: Register + Auto-Login (two-step sequence)

**Direction**: Frontend → Backend (two sequential calls)
**Used in**: User Story 2 (Registration screen)

### Step 1 — Create user account

```
POST /api/v1/users
Content-Type: application/json

{
  "name": "João",
  "surname": "Silva",
  "email": "joao@example.com",
  "password": "secret1234",
  "password_confirm": "secret1234"
}
```

| Status | Body | Frontend action |
|--------|------|-----------------|
| 201 | `UserDTO` | Proceed to Step 2 with same credentials |
| 400 | `WebError` | Show error from `message` field |
| 409 | `WebError` | Show "Este e-mail já está em uso" |
| 422 | `WebError` | Show validation error from `message` field |

### Step 2 — Obtain JWT (auto-login)

If Step 1 succeeds (201), immediately call:

```
POST /api/v1/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "secret1234"
}
```

| Status | Body | Frontend action |
|--------|------|-----------------|
| 200 | `AuthSession` | Store `access_token` in localStorage → redirect `/dashboard` |
| Any error | `WebError` | Show "Conta criada, mas não foi possível entrar automaticamente. Faça login." → redirect `/login` |

---

## AUTH-03: Logout (client-side only)

**Note**: The backend does not expose a logout endpoint. Logout is performed entirely
on the client side.

**Action**:
1. `localStorage.removeItem('mystery_gifter_token')`
2. `router.push('/login')`

No network request is made. The JWT expires naturally per `expires_in` on the backend.

---

## AUTH-04: Authenticated Request Pattern

All protected API calls (future features) MUST include:

```
Authorization: Bearer {localStorage.getItem('mystery_gifter_token')}
```

**On 401 response**:
1. `localStorage.removeItem('mystery_gifter_token')`
2. `router.push('/login')`

---

## WebError shape (all error responses)

```json
{
  "code": "conflict",
  "message": "user already exists",
  "details": null
}
```

Frontend maps `code` to user-friendly pt-BR messages where possible; falls back to
displaying `message` for unknown codes.

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend base URL (no trailing slash) | `http://localhost:8080` |

/** Returned by POST /api/v1/login on success */
export interface AuthSession {
  user: User
  access_token: string
  token_type: 'Bearer'
  expires_in: number
}

/** Returned by POST /api/v1/users on success (201) */
export interface User {
  id: string
  name: string
  surname: string
  email: string
  created_at: string
  updated_at: string
}

/** Returned by the API on error */
export interface ApiError {
  code: string
  message: string
  details?: unknown
}

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
  password: string
  password_confirm: string
}

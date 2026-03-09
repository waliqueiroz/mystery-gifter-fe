import type { AuthSession, LoginCredentials, CreateUserPayload } from '@/types/api'

const ERROR_MESSAGES: Record<number, string> = {
  401: 'E-mail ou senha inválidos.',
  409: 'Este e-mail já está em uso.',
}

function getErrorMessage(status: number): string {
  return ERROR_MESSAGES[status] ?? 'Ocorreu um erro. Tente novamente.'
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const response = await fetch('/api/v1/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    throw new Error(getErrorMessage(response.status))
  }

  return response.json() as Promise<AuthSession>
}

export async function register(payload: CreateUserPayload): Promise<AuthSession> {
  const createResponse = await fetch('/api/v1/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!createResponse.ok) {
    throw new Error(getErrorMessage(createResponse.status))
  }

  return login({ email: payload.email, password: payload.password })
}

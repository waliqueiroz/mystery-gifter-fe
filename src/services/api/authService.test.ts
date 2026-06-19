import { login, register } from './authService'
import { ApiRequestError, ConflictError, UnauthorizedError } from '@/lib/errors'
import type { AuthSession } from '@/types/api'

const mockSession: AuthSession = {
  user: {
    id: '1',
    name: 'João',
    surname: 'Silva',
    email: 'joao@example.com',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  access_token: 'jwt-token',
  token_type: 'Bearer',
  expires_in: 3600,
}

beforeEach(() => {
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.resetAllMocks()
  localStorage.clear()
})

function mockFetchOk(body: unknown) {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  })
}

function mockFetchError(status: number, body: unknown = {}) {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  })
}

describe('login', () => {
  it('calls POST /api/v1/login with credentials', async () => {
    mockFetchOk(mockSession)
    await login({ email: 'joao@example.com', password: 'senha123' })
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/login',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('does not send Authorization header', async () => {
    mockFetchOk(mockSession)
    await login({ email: 'joao@example.com', password: 'senha123' })
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>
    expect(headers).not.toHaveProperty('Authorization')
  })

  it('returns AuthSession on success', async () => {
    mockFetchOk(mockSession)
    const result = await login({ email: 'joao@example.com', password: 'senha123' })
    expect(result).toEqual(mockSession)
  })

  it('throws UnauthorizedError with backend message on 401', async () => {
    mockFetchError(401, { code: 'unauthorized', message: 'invalid credentials' })
    const err = await login({ email: 'x@x.com', password: 'wrong' }).catch((e) => e)
    expect(err).toBeInstanceOf(UnauthorizedError)
    expect(err.message).toBe('invalid credentials')
    expect(err.status).toBe(401)
  })

  it('throws ApiRequestError on server error', async () => {
    mockFetchError(500, { code: 'internal_server_error', message: 'falha interna' })
    const err = await login({ email: 'x@x.com', password: '123' }).catch((e) => e)
    expect(err).toBeInstanceOf(ApiRequestError)
    expect(err.status).toBe(500)
  })

  it('UnauthorizedError is not instanceof ConflictError', async () => {
    mockFetchError(401, { code: 'unauthorized', message: 'invalid credentials' })
    const err = await login({ email: 'x@x.com', password: 'wrong' }).catch((e) => e)
    expect(err instanceof ConflictError).toBe(false)
  })
})

describe('register', () => {
  const payload = {
    name: 'João',
    surname: 'Silva',
    email: 'joao@example.com',
    password: 'senha123',
    password_confirm: 'senha123',
  }

  it('calls POST /api/v1/users then POST /api/v1/login on success', async () => {
    mockFetchOk({})
    mockFetchOk(mockSession)

    const result = await register(payload)
    expect(result).toEqual(mockSession)
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      '/api/v1/users',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      '/api/v1/login',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('throws ConflictError with backend message on 409', async () => {
    mockFetchError(409, { code: 'conflict', message: 'user already exists' })
    const err = await register(payload).catch((e) => e)
    expect(err).toBeInstanceOf(ConflictError)
    expect(err.message).toBe('user already exists')
    expect(err.status).toBe(409)
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('throws ApiRequestError on generic server error', async () => {
    mockFetchError(500, { code: 'internal_server_error', message: 'falha interna' })
    const err = await register(payload).catch((e) => e)
    expect(err).toBeInstanceOf(ApiRequestError)
    expect(err.status).toBe(500)
  })

  it('re-throws network errors as-is', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    await expect(register(payload)).rejects.toThrow('Network error')
  })
})

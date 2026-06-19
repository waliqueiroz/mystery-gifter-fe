import { login, register } from './authService'
import { ApiRequestError, ConflictError, InvalidCredentialsError } from '@/lib/errors'
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

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

describe('login', () => {
  it('returns AuthSession on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSession),
    })

    const result = await login({ email: 'joao@example.com', password: 'senha123' })
    expect(result).toEqual(mockSession)
    expect(mockFetch).toHaveBeenCalledWith('/api/v1/login', expect.objectContaining({ method: 'POST' }))
  })

  it('throws InvalidCredentialsError with correct message on 401', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })
    const err = await login({ email: 'x@x.com', password: 'wrong' }).catch((e) => e)
    expect(err).toBeInstanceOf(InvalidCredentialsError)
    expect(err.message).toBe('E-mail ou senha inválidos.')
    expect(err.status).toBe(401)
  })

  it('throws ApiRequestError on unknown error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })
    const err = await login({ email: 'x@x.com', password: '123' }).catch((e) => e)
    expect(err).toBeInstanceOf(ApiRequestError)
    expect(err.status).toBe(500)
    expect(err.message).toBe('Ocorreu um erro. Tente novamente.')
  })

  it('InvalidCredentialsError is not instanceof ConflictError', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })
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

  it('makes two sequential fetch calls and returns AuthSession on success', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSession) })

    const result = await register(payload)
    expect(result).toEqual(mockSession)
    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/v1/users', expect.objectContaining({ method: 'POST' }))
    expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/v1/login', expect.objectContaining({ method: 'POST' }))
  })

  it('throws ConflictError with correct message on 409', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 409 })
    const err = await register(payload).catch((e) => e)
    expect(err).toBeInstanceOf(ConflictError)
    expect(err.message).toBe('Este e-mail já está em uso.')
    expect(err.status).toBe(409)
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('throws ApiRequestError on generic server error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })
    const err = await register(payload).catch((e) => e)
    expect(err).toBeInstanceOf(ApiRequestError)
    expect(err.status).toBe(500)
  })

  it('re-throws network errors as-is', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    await expect(register(payload)).rejects.toThrow('Network error')
  })
})

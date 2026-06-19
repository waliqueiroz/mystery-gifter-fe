import { apiFetch } from './apiClient'
import {
  ApiRequestError,
  SessionExpiredError,
  NotFoundError,
  ForbiddenError,
} from '@/lib/errors'

beforeEach(() => {
  global.fetch = jest.fn()
  localStorage.setItem('mystery_gifter_token', 'test-token')
})

afterEach(() => {
  jest.resetAllMocks()
  localStorage.clear()
})

function mockFetch(status: number, body: unknown) {
  ;(global.fetch as jest.Mock).mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  })
}

describe('apiFetch', () => {
  it('returns parsed JSON on 200', async () => {
    mockFetch(200, { foo: 'bar' })
    const result = await apiFetch<{ foo: string }>('/api/test')
    expect(result).toEqual({ foo: 'bar' })
  })

  it('sends Authorization header when token exists', async () => {
    mockFetch(200, {})
    await apiFetch('/api/test')
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    )
  })

  it('omits Authorization header when no token', async () => {
    localStorage.clear()
    mockFetch(200, {})
    await apiFetch('/api/test')
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>
    expect(headers).not.toHaveProperty('Authorization')
  })

  it('throws SessionExpiredError on 401 and clears the token', async () => {
    mockFetch(401, {})
    await expect(apiFetch('/api/test')).rejects.toBeInstanceOf(SessionExpiredError)
    expect(localStorage.getItem('mystery_gifter_token')).toBeNull()
  })

  it('throws NotFoundError on 404 with the backend message', async () => {
    mockFetch(404, { code: 'not_found', message: 'recurso não encontrado' })
    const err = await apiFetch('/api/test').catch((e) => e) as NotFoundError
    expect(err).toBeInstanceOf(NotFoundError)
    expect(err.message).toBe('recurso não encontrado')
    expect(err.status).toBe(404)
  })

  it('throws ForbiddenError on 403', async () => {
    mockFetch(403, { code: 'forbidden', message: 'acesso negado' })
    const err = await apiFetch('/api/test').catch((e) => e) as ForbiddenError
    expect(err).toBeInstanceOf(ForbiddenError)
    expect(err.message).toBe('acesso negado')
    expect(err.status).toBe(403)
  })

  it('throws generic ApiRequestError for other error statuses', async () => {
    mockFetch(500, { code: 'internal_server_error', message: 'falha interna' })
    const err = await apiFetch('/api/test').catch((e) => e) as ApiRequestError
    expect(err).toBeInstanceOf(ApiRequestError)
    expect(err.status).toBe(500)
    expect(err.code).toBe('internal_server_error')
  })

  it('uses fallback message when body.message is missing', async () => {
    mockFetch(500, {})
    const err = await apiFetch('/api/test').catch((e) => e) as ApiRequestError
    expect(err.message).toBe('Ocorreu um erro. Tente novamente.')
  })

  it('merges custom headers without overriding auth headers', async () => {
    mockFetch(200, {})
    await apiFetch('/api/test', { headers: { 'X-Custom': 'valor' } })
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>
    expect(headers).toHaveProperty('X-Custom', 'valor')
    expect(headers).toHaveProperty('Authorization', 'Bearer test-token')
  })

  describe('authenticated: false', () => {
    it('omits Authorization header even when token exists', async () => {
      mockFetch(200, {})
      await apiFetch('/api/test', undefined, { authenticated: false })
      const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>
      expect(headers).not.toHaveProperty('Authorization')
    })

    it('throws ApiRequestError on 401 without clearing the token', async () => {
      mockFetch(401, { code: 'unauthorized', message: 'invalid credentials' })
      const err = await apiFetch('/api/test', undefined, { authenticated: false }).catch((e) => e) as ApiRequestError
      expect(err).toBeInstanceOf(ApiRequestError)
      expect(err.status).toBe(401)
      expect(localStorage.getItem('mystery_gifter_token')).toBe('test-token')
    })

    it('is not instanceof SessionExpiredError on 401', async () => {
      mockFetch(401, { code: 'unauthorized', message: 'invalid credentials' })
      const err = await apiFetch('/api/test', undefined, { authenticated: false }).catch((e) => e)
      expect(err instanceof SessionExpiredError).toBe(false)
    })
  })
})

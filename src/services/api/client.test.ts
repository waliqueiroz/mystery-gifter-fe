import { http } from './client'
import {
  ApiRequestError,
  ForbiddenError,
  NotFoundError,
  SessionExpiredError,
  UnauthorizedError,
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

describe('http client', () => {
  it('returns parsed JSON on 200', async () => {
    mockFetch(200, { foo: 'bar' })
    const result = await http<{ foo: string }>('/api/test')
    expect(result).toEqual({ foo: 'bar' })
  })

  it('sends Authorization header when token exists', async () => {
    mockFetch(200, {})
    await http('/api/test')
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      }),
    )
  })

  it('omits Authorization header when no token', async () => {
    localStorage.clear()
    mockFetch(200, {})
    await http('/api/test')
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>
    expect(headers).not.toHaveProperty('Authorization')
  })

  it('throws SessionExpiredError on 401 for protected paths and clears the token', async () => {
    mockFetch(401, {})
    await expect(http('/api/v1/groups/123')).rejects.toBeInstanceOf(SessionExpiredError)
    expect(localStorage.getItem('mystery_gifter_token')).toBeNull()
  })

  it('throws UnauthorizedError on 401 for public paths without clearing the token', async () => {
    mockFetch(401, { code: 'unauthorized', message: 'invalid credentials' })
    const err = await http('/api/v1/login').catch((e) => e)
    expect(err).toBeInstanceOf(UnauthorizedError)
    expect(err instanceof SessionExpiredError).toBe(false)
    expect(localStorage.getItem('mystery_gifter_token')).toBe('test-token')
  })

  it('throws NotFoundError on 404 with the backend message', async () => {
    mockFetch(404, { code: 'not_found', message: 'recurso não encontrado' })
    const err = await http('/api/test').catch((e) => e) as NotFoundError
    expect(err).toBeInstanceOf(NotFoundError)
    expect(err.message).toBe('recurso não encontrado')
  })

  it('throws ForbiddenError on 403', async () => {
    mockFetch(403, { code: 'forbidden', message: 'acesso negado' })
    const err = await http('/api/test').catch((e) => e) as ForbiddenError
    expect(err).toBeInstanceOf(ForbiddenError)
  })

  it('throws generic ApiRequestError for other error statuses', async () => {
    mockFetch(500, { code: 'internal_server_error', message: 'falha interna' })
    const err = await http('/api/test').catch((e) => e) as ApiRequestError
    expect(err).toBeInstanceOf(ApiRequestError)
    expect(err.status).toBe(500)
    expect(err.code).toBe('internal_server_error')
  })

  it('uses fallback message when body.message is missing', async () => {
    mockFetch(500, {})
    const err = await http('/api/test').catch((e) => e) as ApiRequestError
    expect(err.message).toBe('Ocorreu um erro. Tente novamente.')
  })

  it('merges custom headers without losing the auth header', async () => {
    mockFetch(200, {})
    await http('/api/test', { headers: { 'X-Custom': 'valor' } })
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>
    expect(headers).toHaveProperty('X-Custom', 'valor')
    expect(headers).toHaveProperty('Authorization', 'Bearer test-token')
  })
})

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
  it('retorna JSON parseado em 200', async () => {
    mockFetch(200, { foo: 'bar' })
    const result = await apiFetch<{ foo: string }>('/api/test')
    expect(result).toEqual({ foo: 'bar' })
  })

  it('envia Authorization header quando token existe', async () => {
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

  it('omite Authorization header quando não há token', async () => {
    localStorage.clear()
    mockFetch(200, {})
    await apiFetch('/api/test')
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>
    expect(headers).not.toHaveProperty('Authorization')
  })

  it('lança SessionExpiredError em 401 e limpa o token', async () => {
    mockFetch(401, {})
    await expect(apiFetch('/api/test')).rejects.toBeInstanceOf(SessionExpiredError)
    expect(localStorage.getItem('mystery_gifter_token')).toBeNull()
  })

  it('lança NotFoundError em 404 com a mensagem do backend', async () => {
    mockFetch(404, { code: 'not_found', message: 'recurso não encontrado' })
    const err = await apiFetch('/api/test').catch((e) => e) as NotFoundError
    expect(err).toBeInstanceOf(NotFoundError)
    expect(err.message).toBe('recurso não encontrado')
    expect(err.status).toBe(404)
  })

  it('lança ForbiddenError em 403', async () => {
    mockFetch(403, { code: 'forbidden', message: 'acesso negado' })
    const err = await apiFetch('/api/test').catch((e) => e) as ForbiddenError
    expect(err).toBeInstanceOf(ForbiddenError)
    expect(err.message).toBe('acesso negado')
    expect(err.status).toBe(403)
  })

  it('lança ApiRequestError genérico para outros status de erro', async () => {
    mockFetch(500, { code: 'internal_server_error', message: 'falha interna' })
    const err = await apiFetch('/api/test').catch((e) => e) as ApiRequestError
    expect(err).toBeInstanceOf(ApiRequestError)
    expect(err.status).toBe(500)
    expect(err.code).toBe('internal_server_error')
  })

  it('usa mensagem fallback quando body.message está ausente', async () => {
    mockFetch(500, {})
    const err = await apiFetch('/api/test').catch((e) => e) as ApiRequestError
    expect(err.message).toBe('Ocorreu um erro. Tente novamente.')
  })

  it('mescla headers customizados sem sobrescrever os de autenticação', async () => {
    mockFetch(200, {})
    await apiFetch('/api/test', { headers: { 'X-Custom': 'valor' } })
    const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers as Record<string, string>
    expect(headers).toHaveProperty('X-Custom', 'valor')
    expect(headers).toHaveProperty('Authorization', 'Bearer test-token')
  })
})

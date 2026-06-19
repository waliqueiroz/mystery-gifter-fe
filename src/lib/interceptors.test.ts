import {
  authTokenInterceptor,
  contentTypeInterceptor,
  createSessionExpiryInterceptor,
  httpErrorInterceptor,
} from './interceptors'
import {
  ApiRequestError,
  ForbiddenError,
  NotFoundError,
  SessionExpiredError,
} from './errors'
import { TOKEN_KEY } from './auth'

function mockResponse(status: number, body: unknown): Response {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  } as unknown as Response
}

describe('contentTypeInterceptor', () => {
  it('adds Content-Type: application/json', () => {
    const result = contentTypeInterceptor({})
    expect((result.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })

  it('preserves existing headers alongside Content-Type', () => {
    const result = contentTypeInterceptor({ headers: { 'X-Custom': 'value' } })
    const headers = result.headers as Record<string, string>
    expect(headers['X-Custom']).toBe('value')
    expect(headers['Content-Type']).toBe('application/json')
  })

  it('allows caller to override Content-Type', () => {
    const result = contentTypeInterceptor({ headers: { 'Content-Type': 'text/plain' } })
    expect((result.headers as Record<string, string>)['Content-Type']).toBe('text/plain')
  })

  it('preserves other init properties', () => {
    const result = contentTypeInterceptor({ method: 'POST', body: '{}' })
    expect(result.method).toBe('POST')
    expect(result.body).toBe('{}')
  })
})

describe('authTokenInterceptor', () => {
  beforeEach(() => { localStorage.clear() })
  afterEach(() => { localStorage.clear() })

  it('adds Authorization header when token exists', () => {
    localStorage.setItem(TOKEN_KEY, 'my-token')
    const result = authTokenInterceptor({})
    expect((result.headers as Record<string, string>)['Authorization']).toBe('Bearer my-token')
  })

  it('returns init unchanged when no token is stored', () => {
    const init: RequestInit = { method: 'GET' }
    const result = authTokenInterceptor(init)
    expect(result).toBe(init)
  })

  it('does not add Authorization key when no token', () => {
    const result = authTokenInterceptor({})
    expect(result.headers).toBeUndefined()
  })

  it('preserves existing headers when adding the token', () => {
    localStorage.setItem(TOKEN_KEY, 'tok')
    const result = authTokenInterceptor({ headers: { 'Content-Type': 'application/json' } })
    const headers = result.headers as Record<string, string>
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers['Authorization']).toBe('Bearer tok')
  })
})

describe('createSessionExpiryInterceptor', () => {
  beforeEach(() => { localStorage.setItem(TOKEN_KEY, 'tok') })
  afterEach(() => { localStorage.clear() })

  it('throws SessionExpiredError on 401 for non-skipped paths', async () => {
    const interceptor = createSessionExpiryInterceptor(['/api/v1/login'])
    await expect(interceptor(mockResponse(401, {}), '/api/v1/groups/123')).rejects.toBeInstanceOf(SessionExpiredError)
  })

  it('throws SessionExpiredError on 401 for paths that start with but do not end with a skipped path', async () => {
    const interceptor = createSessionExpiryInterceptor(['/api/v1/users'])
    await expect(interceptor(mockResponse(401, {}), '/api/v1/users/u1')).rejects.toBeInstanceOf(SessionExpiredError)
  })

  it('clears the token on 401 for non-skipped paths', async () => {
    const interceptor = createSessionExpiryInterceptor([])
    await interceptor(mockResponse(401, {}), '/api/v1/groups').catch(() => {})
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('passes through 401 without throwing for skipped paths', async () => {
    const interceptor = createSessionExpiryInterceptor(['/api/v1/login'])
    const response = mockResponse(401, {})
    await expect(interceptor(response, '/api/v1/login')).resolves.toBe(response)
  })

  it('does not clear the token on 401 for skipped paths', async () => {
    const interceptor = createSessionExpiryInterceptor(['/api/v1/login'])
    await interceptor(mockResponse(401, {}), '/api/v1/login').catch(() => {})
    expect(localStorage.getItem(TOKEN_KEY)).toBe('tok')
  })

  it('returns response unchanged for 200', async () => {
    const interceptor = createSessionExpiryInterceptor([])
    const response = mockResponse(200, {})
    await expect(interceptor(response, '/api/v1/groups')).resolves.toBe(response)
  })

  it('returns response unchanged for 403', async () => {
    const interceptor = createSessionExpiryInterceptor([])
    const response = mockResponse(403, {})
    await expect(interceptor(response, '/api/v1/groups')).resolves.toBe(response)
  })
})

describe('httpErrorInterceptor', () => {
  const url = '/api/test'

  it('returns the response unchanged on 200', async () => {
    const response = mockResponse(200, { data: 'ok' })
    await expect(httpErrorInterceptor(response, url)).resolves.toBe(response)
  })

  it('returns the response unchanged on 201', async () => {
    const response = mockResponse(201, {})
    await expect(httpErrorInterceptor(response, url)).resolves.toBe(response)
  })

  it('throws NotFoundError on 404 with backend message', async () => {
    const err = await httpErrorInterceptor(
      mockResponse(404, { code: 'not_found', message: 'recurso não encontrado' }), url
    ).catch((e) => e)
    expect(err).toBeInstanceOf(NotFoundError)
    expect(err.message).toBe('recurso não encontrado')
    expect(err.status).toBe(404)
  })

  it('throws ForbiddenError on 403', async () => {
    const err = await httpErrorInterceptor(
      mockResponse(403, { code: 'forbidden', message: 'acesso negado' }), url
    ).catch((e) => e)
    expect(err).toBeInstanceOf(ForbiddenError)
    expect(err.message).toBe('acesso negado')
  })

  it('throws ApiRequestError on 500', async () => {
    const err = await httpErrorInterceptor(
      mockResponse(500, { code: 'internal_server_error', message: 'falha interna' }), url
    ).catch((e) => e)
    expect(err).toBeInstanceOf(ApiRequestError)
    expect(err.status).toBe(500)
    expect(err.code).toBe('internal_server_error')
  })

  it('throws ApiRequestError on 409', async () => {
    const err = await httpErrorInterceptor(
      mockResponse(409, { code: 'conflict', message: 'conflito' }), url
    ).catch((e) => e)
    expect(err).toBeInstanceOf(ApiRequestError)
    expect(err.status).toBe(409)
  })

  it('throws ApiRequestError on 401 (generic — session expiry is handled upstream)', async () => {
    const err = await httpErrorInterceptor(
      mockResponse(401, { code: 'unauthorized', message: 'invalid token' }), url
    ).catch((e) => e)
    expect(err).toBeInstanceOf(ApiRequestError)
    expect(err.status).toBe(401)
  })

  it('uses fallback message when body.message is absent', async () => {
    const err = await httpErrorInterceptor(mockResponse(500, {}), url).catch((e) => e)
    expect(err.message).toBe('Ocorreu um erro. Tente novamente.')
  })
})

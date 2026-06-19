import { createHttpClient } from './httpClient'
import type { RequestInterceptor, ResponseInterceptor } from './httpClient'

beforeEach(() => {
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.resetAllMocks()
})

function mockFetch(status: number, body: unknown) {
  ;(global.fetch as jest.Mock).mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  })
}

describe('createHttpClient', () => {
  it('calls fetch with the url and merged init', async () => {
    mockFetch(200, {})
    const client = createHttpClient()
    await client('/api/test', { method: 'DELETE' })
    expect(global.fetch).toHaveBeenCalledWith('/api/test', { method: 'DELETE' })
  })

  it('returns parsed JSON on success', async () => {
    mockFetch(200, { foo: 'bar' })
    const client = createHttpClient()
    const result = await client<{ foo: string }>('/api/test')
    expect(result).toEqual({ foo: 'bar' })
  })

  it('applies request interceptors in order', async () => {
    mockFetch(200, {})
    const order: string[] = []
    const a: RequestInterceptor = (init) => { order.push('a'); return { ...init, headers: { ...init.headers as Record<string, string>, 'X-A': 'a' } } }
    const b: RequestInterceptor = (init) => { order.push('b'); return { ...init, headers: { ...init.headers as Record<string, string>, 'X-B': 'b' } } }
    const client = createHttpClient({ requestInterceptors: [a, b] })
    await client('/api/test')
    expect(order).toEqual(['a', 'b'])
    const [, calledInit] = (global.fetch as jest.Mock).mock.calls[0]
    expect(calledInit.headers).toMatchObject({ 'X-A': 'a', 'X-B': 'b' })
  })

  it('applies response interceptors in order', async () => {
    mockFetch(200, {})
    const order: string[] = []
    const a: ResponseInterceptor = async (r) => { order.push('a'); return r }
    const b: ResponseInterceptor = async (r) => { order.push('b'); return r }
    const client = createHttpClient({ responseInterceptors: [a, b] })
    await client('/api/test')
    expect(order).toEqual(['a', 'b'])
  })

  it('stops the chain when a response interceptor throws', async () => {
    mockFetch(401, {})
    const bCalled = jest.fn()
    const a: ResponseInterceptor = async () => { throw new Error('blocked') }
    const b: ResponseInterceptor = async (r) => { bCalled(); return r }
    const client = createHttpClient({ responseInterceptors: [a, b] })
    await expect(client('/api/test')).rejects.toThrow('blocked')
    expect(bCalled).not.toHaveBeenCalled()
  })

  it('works with no interceptors configured', async () => {
    mockFetch(200, { value: 42 })
    const client = createHttpClient()
    const result = await client<{ value: number }>('/api/test')
    expect(result).toEqual({ value: 42 })
  })

  it('uses empty init when no init is passed', async () => {
    mockFetch(200, {})
    const client = createHttpClient()
    await client('/api/test')
    expect(global.fetch).toHaveBeenCalledWith('/api/test', {})
  })
})

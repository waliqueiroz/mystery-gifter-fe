export type RequestInterceptor = (init: RequestInit) => RequestInit
export type ResponseInterceptor = (response: Response, url: string) => Promise<Response>

export interface HttpClientConfig {
  requestInterceptors?: RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor[]
}

export type ApiClient = <T>(url: string, init?: RequestInit) => Promise<T>

export function createHttpClient(config: HttpClientConfig = {}): ApiClient {
  const requestInterceptors = config.requestInterceptors ?? []
  const responseInterceptors = config.responseInterceptors ?? []

  return async function <T>(url: string, init: RequestInit = {}): Promise<T> {
    const finalInit = requestInterceptors.reduce((acc, fn) => fn(acc), init)
    let response = await fetch(url, finalInit)
    for (const fn of responseInterceptors) {
      response = await fn(response, url)
    }
    return response.json() as Promise<T>
  }
}

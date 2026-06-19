import { createHttpClient } from '@/lib/httpClient'
import {
  authTokenInterceptor,
  contentTypeInterceptor,
  createSessionExpiryInterceptor,
  httpErrorInterceptor,
} from '@/lib/interceptors'

const PUBLIC_PATHS = ['/api/v1/login', '/api/v1/users']

export const http = createHttpClient({
  requestInterceptors: [contentTypeInterceptor, authTokenInterceptor],
  responseInterceptors: [createSessionExpiryInterceptor(PUBLIC_PATHS), httpErrorInterceptor],
})

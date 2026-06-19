import { createHttpClient } from './httpClient'
import {
  authTokenInterceptor,
  contentTypeInterceptor,
  httpErrorInterceptor,
  sessionExpiryInterceptor,
} from './interceptors'

export const apiFetch = createHttpClient({
  requestInterceptors: [contentTypeInterceptor, authTokenInterceptor],
  responseInterceptors: [sessionExpiryInterceptor, httpErrorInterceptor],
})

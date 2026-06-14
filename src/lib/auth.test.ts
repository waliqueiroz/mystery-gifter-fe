import { TOKEN_KEY, getToken, setToken, clearToken, isAuthenticated } from './auth'
import { USER_KEY } from './session'

describe('auth helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getToken', () => {
    it('returns null when no token is stored', () => {
      expect(getToken()).toBeNull()
    })

    it('returns the stored token', () => {
      localStorage.setItem(TOKEN_KEY, 'test-token')
      expect(getToken()).toBe('test-token')
    })

    it('returns null when window is undefined (SSR)', () => {
      const originalWindow = global.window
      // @ts-expect-error simulating SSR
      delete global.window
      expect(getToken()).toBeNull()
      global.window = originalWindow
    })
  })

  describe('setToken', () => {
    it('stores the token in localStorage', () => {
      setToken('my-jwt')
      expect(localStorage.getItem(TOKEN_KEY)).toBe('my-jwt')
    })
  })

  describe('clearToken', () => {
    it('removes the token from localStorage', () => {
      localStorage.setItem(TOKEN_KEY, 'test-token')
      clearToken()
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    })

    it('also clears the stored user', () => {
      localStorage.setItem(TOKEN_KEY, 'test-token')
      localStorage.setItem(USER_KEY, JSON.stringify({ id: 'u1' }))
      clearToken()
      expect(localStorage.getItem(USER_KEY)).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('returns false when no token is stored', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('returns true when token is stored', () => {
      localStorage.setItem(TOKEN_KEY, 'test-token')
      expect(isAuthenticated()).toBe(true)
    })
  })
})

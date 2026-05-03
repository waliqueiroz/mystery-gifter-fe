import type { User } from '@/types/api'
import { USER_KEY, getUser, setUser, clearUser } from './session'

const mockUser: User = {
  id: 'user-1',
  name: 'João',
  surname: 'Silva',
  email: 'joao@example.com',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('session helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getUser', () => {
    it('returns null when no user is stored', () => {
      expect(getUser()).toBeNull()
    })

    it('returns the stored user', () => {
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser))
      expect(getUser()).toEqual(mockUser)
    })

    it('returns null when stored value is invalid JSON', () => {
      localStorage.setItem(USER_KEY, 'not-valid-json')
      expect(getUser()).toBeNull()
    })

    it('returns null when window is undefined (SSR)', () => {
      const originalWindow = global.window
      // @ts-expect-error simulating SSR
      delete global.window
      expect(getUser()).toBeNull()
      global.window = originalWindow
    })
  })

  describe('setUser', () => {
    it('stores the user as JSON in localStorage', () => {
      setUser(mockUser)
      expect(localStorage.getItem(USER_KEY)).toBe(JSON.stringify(mockUser))
    })
  })

  describe('clearUser', () => {
    it('removes the user from localStorage', () => {
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser))
      clearUser()
      expect(localStorage.getItem(USER_KEY)).toBeNull()
    })
  })
})

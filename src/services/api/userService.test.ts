import { getUserById } from './userService'
import { SessionExpiredError, NotFoundError } from '@/lib/errors'
import type { User } from '@/types/api'

const mockUser: User = {
  id: 'u1',
  name: 'João',
  surname: 'Silva',
  email: 'joao@example.com',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
}

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

describe('userService', () => {
  describe('getUserById', () => {
    it('calls GET /api/v1/users/:id with auth header', async () => {
      mockFetch(200, mockUser)
      await getUserById('u1')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/users/u1',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        }),
      )
    })

    it('returns User on success', async () => {
      mockFetch(200, mockUser)
      const user = await getUserById('u1')
      expect(user).toEqual(mockUser)
    })

    it('throws NotFoundError on 404 with backend message', async () => {
      mockFetch(404, { code: 'not_found', message: 'Usuário não encontrado.' })
      const err = await getUserById('u1').catch((e) => e)
      expect(err).toBeInstanceOf(NotFoundError)
      expect(err.message).toBe('Usuário não encontrado.')
    })

    it('throws SessionExpiredError and clears token on 401', async () => {
      mockFetch(401, {})
      await expect(getUserById('u1')).rejects.toBeInstanceOf(SessionExpiredError)
      expect(localStorage.getItem('mystery_gifter_token')).toBeNull()
    })
  })
})

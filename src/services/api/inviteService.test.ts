import {
  getActiveInvite,
  createInvite,
  joinGroup,
  getUserMatch,
} from './inviteService'
import {
  ApiRequestError,
  SessionExpiredError,
  NotFoundError,
  DrawCompletedError,
  InvalidInviteError,
} from '@/lib/errors'
import type { GroupInvite, Group, User } from '@/types/api'

const mockInvite: GroupInvite = {
  id: 'inv-1',
  group_id: 'g1',
  expires_at: '2026-12-31T00:00:00Z',
  created_at: '2026-01-01T00:00:00Z',
}

const mockGroup: Group = {
  id: 'g1',
  name: 'Grupo',
  description: '',
  users: [],
  owner_id: 'u1',
  matches: [],
  status: 'OPEN',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

const mockUser: User = {
  id: 'u2',
  name: 'Maria',
  surname: 'Santos',
  email: 'maria@example.com',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
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

describe('inviteService', () => {
  describe('getActiveInvite', () => {
    it('calls GET /api/v1/groups/:id/invites/active', async () => {
      mockFetch(200, mockInvite)
      await getActiveInvite('g1')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/groups/g1/invites/active',
        expect.any(Object),
      )
    })

    it('returns the invite on success', async () => {
      mockFetch(200, mockInvite)
      const result = await getActiveInvite('g1')
      expect(result).toEqual(mockInvite)
    })

    it('throws NotFoundError on 404', async () => {
      mockFetch(404, { code: 'not_found', message: 'Convite não encontrado.' })
      await expect(getActiveInvite('g1')).rejects.toBeInstanceOf(NotFoundError)
    })
  })

  describe('createInvite', () => {
    it('calls POST /api/v1/groups/:id/invites', async () => {
      mockFetch(201, mockInvite)
      await createInvite('g1')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/groups/g1/invites',
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })

  describe('joinGroup', () => {
    it('calls POST /api/v1/invites/:token/join', async () => {
      mockFetch(200, mockGroup)
      await joinGroup('invite-token-abc')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/invites/invite-token-abc/join',
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('returns the group on success', async () => {
      mockFetch(200, mockGroup)
      const result = await joinGroup('token')
      expect(result).toEqual(mockGroup)
    })

    it('throws InvalidInviteError quando convite não existe (404)', async () => {
      mockFetch(404, { code: 'not_found', message: 'group invite not found' })
      const err = await joinGroup('token').catch((e) => e)
      expect(err).toBeInstanceOf(InvalidInviteError)
      expect(err.status).toBe(404)
    })

    it('throws InvalidInviteError quando convite expirou (409 invite has expired)', async () => {
      mockFetch(409, { code: 'conflict', message: 'invite has expired' })
      const err = await joinGroup('token').catch((e) => e)
      expect(err).toBeInstanceOf(InvalidInviteError)
      expect(err.status).toBe(409)
    })

    it('throws DrawCompletedError quando grupo não está OPEN (409 group not open)', async () => {
      mockFetch(409, {
        code: 'conflict',
        message:
          'group is not open for registration, contact the group owner to reopen the group',
      })
      const err = await joinGroup('token').catch((e) => e)
      expect(err).toBeInstanceOf(DrawCompletedError)
    })

    it('re-lança ApiRequestError para outros erros não mapeados (500)', async () => {
      mockFetch(500, { code: 'internal_server_error', message: 'falha interna' })
      const err = await joinGroup('token').catch((e) => e)
      expect(err).toBeInstanceOf(ApiRequestError)
      expect(err.status).toBe(500)
    })
  })

  describe('getUserMatch', () => {
    it('calls GET /api/v1/groups/:id/matches/user', async () => {
      mockFetch(200, mockUser)
      await getUserMatch('g1')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/groups/g1/matches/user',
        expect.any(Object),
      )
    })

    it('returns the recipient user on success', async () => {
      mockFetch(200, mockUser)
      const result = await getUserMatch('g1')
      expect(result).toEqual(mockUser)
    })
  })

  describe('error handling', () => {
    it('throws SessionExpiredError e limpa o token em 401', async () => {
      mockFetch(401, {})
      await expect(joinGroup('token')).rejects.toBeInstanceOf(SessionExpiredError)
      expect(localStorage.getItem('mystery_gifter_token')).toBeNull()
    })
  })
})

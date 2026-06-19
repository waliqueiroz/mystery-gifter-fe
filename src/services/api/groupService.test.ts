import {
  listGroups,
  createGroup,
  getGroup,
  removeMember,
  generateDraw,
  reopenGroup,
  archiveGroup,
} from './groupService'
import { SessionExpiredError, ForbiddenError } from '@/lib/errors'
import type { Group, GroupSearchResult } from '@/types/api'

const mockGroup: Group = {
  id: 'g1',
  name: 'Amigo Secreto 2026',
  description: '',
  users: [],
  owner_id: 'u1',
  matches: [],
  status: 'OPEN',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

const mockSearchResult: GroupSearchResult = {
  result: [],
  paging: { limit: 15, offset: 0, total: 0 },
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

describe('groupService', () => {
  describe('listGroups', () => {
    it('calls GET /api/v1/groups with default params (OPEN + MATCHED, DESC)', async () => {
      mockFetch(200, mockSearchResult)
      await listGroups({ userId: 'u1', offset: 0, limit: 15 })
      const url = (global.fetch as jest.Mock).mock.calls[0][0] as string
      expect(url).toContain('/api/v1/groups')
      expect(url).toContain('user_id=u1')
      expect(url).toContain('status=OPEN')
      expect(url).toContain('status=MATCHED')
      expect(url).toContain('sort_direction=DESC')
    })

    it('returns GroupSearchResult on success', async () => {
      mockFetch(200, mockSearchResult)
      const result = await listGroups({ userId: 'u1' })
      expect(result).toEqual(mockSearchResult)
    })

    it('appends name param when provided', async () => {
      mockFetch(200, mockSearchResult)
      await listGroups({ userId: 'u1', name: 'natal' })
      const url = (global.fetch as jest.Mock).mock.calls[0][0] as string
      expect(url).toContain('name=natal')
    })

    it('sends no status params when statuses array is empty', async () => {
      mockFetch(200, mockSearchResult)
      await listGroups({ userId: 'u1', statuses: [] })
      const url = (global.fetch as jest.Mock).mock.calls[0][0] as string
      expect(url).not.toContain('status=')
    })

    it('sends only ARCHIVED when statuses contains only ARCHIVED', async () => {
      mockFetch(200, mockSearchResult)
      await listGroups({ userId: 'u1', statuses: ['ARCHIVED'] })
      const url = (global.fetch as jest.Mock).mock.calls[0][0] as string
      expect(url).toContain('status=ARCHIVED')
      expect(url).not.toContain('status=OPEN')
      expect(url).not.toContain('status=MATCHED')
    })

    it('sends sort_direction=ASC when specified', async () => {
      mockFetch(200, mockSearchResult)
      await listGroups({ userId: 'u1', sortDirection: 'ASC' })
      const url = (global.fetch as jest.Mock).mock.calls[0][0] as string
      expect(url).toContain('sort_direction=ASC')
    })
  })

  describe('createGroup', () => {
    it('calls POST /api/v1/groups', async () => {
      mockFetch(201, mockGroup)
      await createGroup({ name: 'Grupo Novo' })
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/groups',
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('returns the created group', async () => {
      mockFetch(201, mockGroup)
      const group = await createGroup({ name: 'Grupo Novo' })
      expect(group).toEqual(mockGroup)
    })
  })

  describe('getGroup', () => {
    it('calls GET /api/v1/groups/:id', async () => {
      mockFetch(200, mockGroup)
      await getGroup('g1')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/groups/g1',
        expect.any(Object),
      )
    })
  })

  describe('removeMember', () => {
    it('calls DELETE /api/v1/groups/:groupId/users/:userId', async () => {
      mockFetch(200, mockGroup)
      await removeMember('g1', 'u2')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/groups/g1/users/u2',
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })

  describe('generateDraw', () => {
    it('calls POST /api/v1/groups/:id/matches', async () => {
      mockFetch(200, { ...mockGroup, status: 'MATCHED' })
      await generateDraw('g1')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/groups/g1/matches',
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })

  describe('reopenGroup', () => {
    it('calls POST /api/v1/groups/:id/reopen', async () => {
      mockFetch(200, mockGroup)
      await reopenGroup('g1')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/groups/g1/reopen',
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })

  describe('archiveGroup', () => {
    it('calls POST /api/v1/groups/:id/archive', async () => {
      mockFetch(200, { ...mockGroup, status: 'ARCHIVED' })
      await archiveGroup('g1')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/groups/g1/archive',
        expect.objectContaining({ method: 'POST' }),
      )
    })
  })

  describe('error handling', () => {
    it('throws ForbiddenError on 403 with backend message', async () => {
      mockFetch(403, { code: 'forbidden', message: 'Acesso negado.' })
      const err = await getGroup('g1').catch((e) => e)
      expect(err).toBeInstanceOf(ForbiddenError)
      expect(err.message).toBe('Acesso negado.')
    })

    it('throws SessionExpiredError and clears token on 401', async () => {
      mockFetch(401, {})
      await expect(getGroup('g1')).rejects.toBeInstanceOf(SessionExpiredError)
      expect(localStorage.getItem('mystery_gifter_token')).toBeNull()
    })
  })
})

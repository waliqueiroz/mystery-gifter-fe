import { act, render, screen, waitFor } from '@testing-library/react'

import * as userContext from '@/contexts/UserContext'
import * as groupService from '@/services/api/groupService'
import { ForbiddenError, NotFoundError } from '@/lib/errors'
import type { Group } from '@/types/api'

import GroupDetailPage from './page'

jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
}))

jest.mock('@/components/groups/GroupStatusBadge/GroupStatusBadge', () => ({
  GroupStatusBadge: ({ status }: { status: string }) => (
    <span data-testid="status-badge">{status}</span>
  ),
}))

jest.mock('@/components/groups/InviteSection/InviteSection', () => ({
  InviteSection: ({
    groupId,
    groupStatus,
  }: {
    groupId: string
    groupStatus: string
  }) => (
    <div
      data-testid="invite-section"
      data-group-id={groupId}
      data-group-status={groupStatus}
    />
  ),
}))

jest.mock('@/components/groups/MemberList/MemberList', () => ({
  MemberList: ({
    group,
    currentUserId,
  }: {
    group: { id: string }
    currentUserId: string
  }) => (
    <div
      data-testid="member-list"
      data-group-id={group.id}
      data-current-user-id={currentUserId}
    />
  ),
}))

jest.mock('@/components/groups/DrawButton/DrawButton', () => ({
  DrawButton: () => <div data-testid="draw-button" />,
}))

jest.mock('@/components/groups/ResultReveal/ResultReveal', () => ({
  ResultReveal: ({ groupId }: { groupId: string }) => (
    <div data-testid="result-reveal" data-group-id={groupId} />
  ),
}))

jest.mock('@/components/groups/GroupActions/GroupActions', () => ({
  GroupActions: () => <div data-testid="group-actions" />,
}))

jest.mock('@/services/api/groupService', () => ({ getGroup: jest.fn() }))

const mockShowToast = jest.fn()
const mockPush = jest.fn()

jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'g1' }),
  useRouter: () => ({ push: mockPush }),
}))

const mockGetGroup = groupService.getGroup as jest.Mock
const mockUseUser = userContext.useUser as jest.Mock

function makeGroup(overrides: Partial<Group> = {}): Group {
  return {
    id: 'g1',
    name: 'Grupo Teste',
    description: '',
    status: 'OPEN',
    owner_id: 'u1',
    users: [],
    matches: [],
    created_at: '',
    updated_at: '',
    ...overrides,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUseUser.mockReturnValue({
    id: 'u1',
    name: 'Ana',
    surname: 'Lima',
    email: 'a@a.com',
  })
})

describe('GroupDetailPage', () => {
  it('root container has desk:max-w-content for desktop centering', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    const { container } = render(<GroupDetailPage />)
    await screen.findByText('Grupo Teste')
    const root = container.querySelector('[class*="desk:max-w-content"]')
    expect(root).not.toBeNull()
  })

  it('does NOT show spinner — displays skeleton after the delay (FR-024)', () => {
    jest.useFakeTimers()
    try {
      mockGetGroup.mockReturnValue(new Promise(() => {}))
      render(<GroupDetailPage />)
      act(() => {
        jest.advanceTimersByTime(160)
      })
      expect(
        screen.getByTestId('group-detail-skeleton'),
      ).toBeInTheDocument()
      expect(screen.queryByRole('status', { name: /carregando/i })).toBeNull()
    } finally {
      jest.useRealTimers()
    }
  })

  it('renders name and status badge after load', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    render(<GroupDetailPage />)
    expect(await screen.findByText('Grupo Teste')).toBeInTheDocument()
    expect(screen.getByTestId('status-badge')).toHaveTextContent('OPEN')
  })

  it('renders InviteSection with groupId and groupStatus', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    render(<GroupDetailPage />)
    await screen.findByText('Grupo Teste')
    const section = screen.getByTestId('invite-section')
    expect(section).toHaveAttribute('data-group-id', 'g1')
    expect(section).toHaveAttribute('data-group-status', 'OPEN')
  })

  it('shows "Grupo não encontrado." toast and redirects when fetch fails with NotFoundError', async () => {
    mockGetGroup.mockRejectedValue(new NotFoundError('group not found'))
    render(<GroupDetailPage />)
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Grupo não encontrado.',
        type: 'error',
      }),
    )
    expect(mockPush).toHaveBeenCalledWith('/groups')
  })

  it('shows "Você não faz parte deste grupo." toast and redirects when fetch fails with ForbiddenError', async () => {
    mockGetGroup.mockRejectedValue(new ForbiddenError('forbidden'))
    render(<GroupDetailPage />)
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Você não faz parte deste grupo.',
        type: 'error',
      }),
    )
    expect(mockPush).toHaveBeenCalledWith('/groups')
  })

  it('shows generic error toast and redirects on unexpected error', async () => {
    mockGetGroup.mockRejectedValue(new Error('server error'))
    render(<GroupDetailPage />)
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Erro ao carregar o grupo.',
        type: 'error',
      }),
    )
    expect(mockPush).toHaveBeenCalledWith('/groups')
  })

  it('calls getGroup with the correct id', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    render(<GroupDetailPage />)
    await waitFor(() => expect(mockGetGroup).toHaveBeenCalledWith('g1'))
  })

  it('renders MemberList with correct group and currentUserId', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    render(<GroupDetailPage />)
    await screen.findByText('Grupo Teste')
    const memberList = screen.getByTestId('member-list')
    expect(memberList).toHaveAttribute('data-group-id', 'g1')
    expect(memberList).toHaveAttribute('data-current-user-id', 'u1')
  })

  describe('DrawButton', () => {
    it('renders for the owner in an OPEN group', async () => {
      mockGetGroup.mockResolvedValue(makeGroup({ owner_id: 'u1' }))
      render(<GroupDetailPage />)
      await screen.findByText('Grupo Teste')
      expect(screen.getByTestId('draw-button')).toBeInTheDocument()
    })

    it('does NOT render for non-owner', async () => {
      mockUseUser.mockReturnValue({
        id: 'u2',
        name: 'Bruno',
        surname: 'Costa',
        email: 'b@b.com',
      })
      mockGetGroup.mockResolvedValue(makeGroup({ owner_id: 'u1' }))
      render(<GroupDetailPage />)
      await screen.findByText('Grupo Teste')
      expect(screen.queryByTestId('draw-button')).toBeNull()
    })

    it('does NOT render when the group is NOT OPEN', async () => {
      mockGetGroup.mockResolvedValue(
        makeGroup({ owner_id: 'u1', status: 'MATCHED' }),
      )
      render(<GroupDetailPage />)
      await screen.findByText('Grupo Teste')
      expect(screen.queryByTestId('draw-button')).toBeNull()
    })
  })

  describe('ResultReveal', () => {
    it('renders when status is MATCHED', async () => {
      mockGetGroup.mockResolvedValue(makeGroup({ status: 'MATCHED' }))
      render(<GroupDetailPage />)
      await screen.findByText('Grupo Teste')
      const reveal = screen.getByTestId('result-reveal')
      expect(reveal).toHaveAttribute('data-group-id', 'g1')
    })

    it('does NOT render when status is OPEN', async () => {
      mockGetGroup.mockResolvedValue(makeGroup({ status: 'OPEN' }))
      render(<GroupDetailPage />)
      await screen.findByText('Grupo Teste')
      expect(screen.queryByTestId('result-reveal')).toBeNull()
    })
  })

  describe('GroupActions', () => {
    it('renders for the owner when NOT archived', async () => {
      mockGetGroup.mockResolvedValue(
        makeGroup({ owner_id: 'u1', status: 'OPEN' }),
      )
      render(<GroupDetailPage />)
      await screen.findByText('Grupo Teste')
      expect(screen.getByTestId('group-actions')).toBeInTheDocument()
    })

    it('does NOT render for non-owner', async () => {
      mockUseUser.mockReturnValue({
        id: 'u2',
        name: 'Bruno',
        surname: 'Costa',
        email: 'b@b.com',
      })
      mockGetGroup.mockResolvedValue(
        makeGroup({ owner_id: 'u1', status: 'OPEN' }),
      )
      render(<GroupDetailPage />)
      await screen.findByText('Grupo Teste')
      expect(screen.queryByTestId('group-actions')).toBeNull()
    })

    it('does NOT render when the group is ARCHIVED', async () => {
      mockGetGroup.mockResolvedValue(
        makeGroup({ owner_id: 'u1', status: 'ARCHIVED' }),
      )
      render(<GroupDetailPage />)
      await screen.findByText('Grupo Teste')
      expect(screen.queryByTestId('group-actions')).toBeNull()
    })
  })
})

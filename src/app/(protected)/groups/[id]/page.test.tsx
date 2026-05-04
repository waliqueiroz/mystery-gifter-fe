import { render, screen, waitFor } from '@testing-library/react'
import GroupDetailPage from './page'
import * as groupService from '@/services/api/groupService'
import * as session from '@/lib/session'
import type { Group } from '@/types/api'

jest.mock('@/components/auth/AuthGuard', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('@/components/groups/GroupStatusBadge/GroupStatusBadge', () => ({
  GroupStatusBadge: ({ status }: { status: string }) => (
    <span data-testid="status-badge">{status}</span>
  ),
}))

jest.mock('@/components/groups/InviteSection/InviteSection', () => ({
  InviteSection: ({ groupId, isOwner }: { groupId: string; isOwner: boolean }) => (
    <div data-testid="invite-section" data-group-id={groupId} data-is-owner={String(isOwner)} />
  ),
}))

jest.mock('@/components/groups/MemberList/MemberList', () => ({
  MemberList: ({ group, currentUserId }: { group: { id: string }; currentUserId: string }) => (
    <div data-testid="member-list" data-group-id={group.id} data-current-user-id={currentUserId} />
  ),
}))

jest.mock('@/services/api/groupService', () => ({ getGroup: jest.fn() }))
jest.mock('@/lib/session', () => ({ getUser: jest.fn() }))

const mockShowToast = jest.fn()
const mockPush = jest.fn()

jest.mock('@/components/ui/Toast/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'g1' }),
  useRouter: () => ({ push: mockPush }),
}))

const mockGetGroup = groupService.getGroup as jest.Mock
const mockGetUser = session.getUser as jest.Mock

function makeGroup(overrides: Partial<Group> = {}): Group {
  return {
    id: 'g1', name: 'Grupo Teste', description: '', status: 'OPEN',
    owner_id: 'u1', users: [], matches: [], created_at: '', updated_at: '',
    ...overrides,
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGetUser.mockReturnValue({ id: 'u1', name: 'Ana', surname: 'Lima', email: 'a@a.com' })
})

describe('GroupDetailPage', () => {
  it('shows loading spinner initially', () => {
    mockGetGroup.mockReturnValue(new Promise(() => {}))
    render(<GroupDetailPage />)
    expect(screen.getByRole('status', { name: /carregando grupo/i })).toBeInTheDocument()
  })

  it('renders group name and status badge after load', async () => {
    mockGetGroup.mockResolvedValue(makeGroup())
    render(<GroupDetailPage />)
    expect(await screen.findByText('Grupo Teste')).toBeInTheDocument()
    expect(screen.getByTestId('status-badge')).toHaveTextContent('OPEN')
  })

  it('renders InviteSection with correct props for owner', async () => {
    mockGetGroup.mockResolvedValue(makeGroup({ owner_id: 'u1' }))
    render(<GroupDetailPage />)
    await screen.findByText('Grupo Teste')
    const section = screen.getByTestId('invite-section')
    expect(section).toHaveAttribute('data-group-id', 'g1')
    expect(section).toHaveAttribute('data-is-owner', 'true')
  })

  it('renders InviteSection with isOwner=false for non-owner', async () => {
    mockGetUser.mockReturnValue({ id: 'u2', name: 'Bruno', surname: 'Costa', email: 'b@b.com' })
    mockGetGroup.mockResolvedValue(makeGroup({ owner_id: 'u1' }))
    render(<GroupDetailPage />)
    await screen.findByText('Grupo Teste')
    expect(screen.getByTestId('invite-section')).toHaveAttribute('data-is-owner', 'false')
  })

  it('shows error toast and redirects to /groups on fetch failure', async () => {
    mockGetGroup.mockRejectedValue(new Error('Grupo não encontrado.'))
    render(<GroupDetailPage />)
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({ message: 'Grupo não encontrado.', type: 'error' }),
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
})

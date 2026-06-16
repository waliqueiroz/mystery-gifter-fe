import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemberList } from './MemberList'
import * as groupService from '@/services/api/groupService'
import type { Group, User } from '@/types/api'

jest.mock('@/services/api/groupService', () => ({ removeMember: jest.fn() }))

const mockShowToast = jest.fn()
jest.mock('@/components/ui/Toast/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

jest.mock('@/components/groups/MemberProfileModal/MemberProfileModal', () => ({
  MemberProfileModal: ({ userId, onClose }: { userId: string | null; onClose: () => void }) =>
    userId ? (
      <div data-testid="member-profile-modal" data-userid={userId}>
        <button onClick={onClose}>Fechar modal</button>
      </div>
    ) : null,
}))

const mockRemoveMember = groupService.removeMember as jest.Mock

const owner: User = { id: 'u1', name: 'Ana', surname: 'Lima', email: 'ana@e.com', created_at: '', updated_at: '' }
const member: User = { id: 'u2', name: 'Bruno', surname: 'Costa', email: 'b@e.com', created_at: '', updated_at: '' }

const baseGroup: Group = {
  id: 'g1', name: 'Grupo', description: '', users: [owner, member],
  owner_id: 'u1', matches: [], status: 'OPEN',
  created_at: '', updated_at: '',
}

beforeEach(() => jest.clearAllMocks())

describe('MemberList', () => {
  it('renders all members', () => {
    render(<MemberList group={baseGroup} currentUserId="u1" onGroupUpdate={() => {}} />)
    expect(screen.getByText(/Ana Lima/)).toBeInTheDocument()
    expect(screen.getByText(/Bruno Costa/)).toBeInTheDocument()
  })

  it('shows "dono" badge next to owner', () => {
    render(<MemberList group={baseGroup} currentUserId="u1" onGroupUpdate={() => {}} />)
    expect(screen.getByText('dono')).toBeInTheDocument()
  })

  it('shows remove button for non-owner members when current user is owner and status is OPEN', () => {
    render(<MemberList group={baseGroup} currentUserId="u1" onGroupUpdate={() => {}} />)
    expect(screen.getByRole('button', { name: /remover Bruno/i })).toBeInTheDocument()
  })

  it('does not show remove buttons for non-owner users', () => {
    render(<MemberList group={baseGroup} currentUserId="u2" onGroupUpdate={() => {}} />)
    expect(screen.queryByRole('button', { name: /remover/i })).not.toBeInTheDocument()
  })

  it('disables remove button when status is not OPEN', () => {
    const matchedGroup = { ...baseGroup, status: 'MATCHED' as const }
    render(<MemberList group={matchedGroup} currentUserId="u1" onGroupUpdate={() => {}} />)
    expect(screen.getByRole('button', { name: /remover Bruno/i })).toBeDisabled()
  })

  it('calls removeMember and fires onGroupUpdate on click', async () => {
    const updatedGroup = { ...baseGroup, users: [owner] }
    mockRemoveMember.mockResolvedValue(updatedGroup)
    const onGroupUpdate = jest.fn()
    render(<MemberList group={baseGroup} currentUserId="u1" onGroupUpdate={onGroupUpdate} />)
    await userEvent.click(screen.getByRole('button', { name: /remover Bruno/i }))
    await waitFor(() => expect(mockRemoveMember).toHaveBeenCalledWith('g1', 'u2'))
    expect(onGroupUpdate).toHaveBeenCalledWith(updatedGroup)
  })

  it('shows error toast when remove fails', async () => {
    mockRemoveMember.mockRejectedValue(new Error('Falha ao remover.'))
    render(<MemberList group={baseGroup} currentUserId="u1" onGroupUpdate={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /remover Bruno/i }))
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({ message: 'Falha ao remover.', type: 'error' }),
    )
  })

  it('member name renders as a clickable button', () => {
    render(<MemberList group={baseGroup} currentUserId="u1" onGroupUpdate={() => {}} />)
    expect(screen.getByRole('button', { name: /ver perfil de Ana Lima/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ver perfil de Bruno Costa/i })).toBeInTheDocument()
  })

  it('clicking a member button opens MemberProfileModal with correct userId', async () => {
    render(<MemberList group={baseGroup} currentUserId="u1" onGroupUpdate={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /ver perfil de Bruno Costa/i }))
    const modal = screen.getByTestId('member-profile-modal')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveAttribute('data-userid', 'u2')
  })

  it('onClose callback resets selectedUserId so modal is hidden', async () => {
    render(<MemberList group={baseGroup} currentUserId="u1" onGroupUpdate={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /ver perfil de Bruno Costa/i }))
    expect(screen.getByTestId('member-profile-modal')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /fechar modal/i }))
    expect(screen.queryByTestId('member-profile-modal')).not.toBeInTheDocument()
  })
})

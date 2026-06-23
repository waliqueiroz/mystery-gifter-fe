import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as groupService from '@/services/api/groupService'
import type { Group, User } from '@/types/api'

import { MemberList } from './MemberList'

jest.mock('@/services/api/groupService', () => ({ removeMember: jest.fn() }))

const mockShowToast = jest.fn()
jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

jest.mock(
  '@/components/groups/MemberProfileSheet/MemberProfileSheet',
  () => ({
    MemberProfileSheet: ({
      user,
      onClose,
    }: {
      user: User | null
      onClose: () => void
    }) =>
      user ? (
        <div data-testid="member-profile-sheet" data-userid={user.id}>
          <button onClick={onClose}>Fechar sheet</button>
        </div>
      ) : null,
  }),
)

const mockRemoveMember = groupService.removeMember as jest.Mock

const owner: User = {
  id: 'u1',
  name: 'Ana',
  surname: 'Lima',
  email: 'ana@e.com',
  created_at: '',
  updated_at: '',
}
const member: User = {
  id: 'u2',
  name: 'Bruno',
  surname: 'Costa',
  email: 'b@e.com',
  created_at: '',
  updated_at: '',
}

const baseGroup: Group = {
  id: 'g1',
  name: 'Grupo',
  description: '',
  users: [owner, member],
  owner_id: 'u1',
  matches: [],
  status: 'OPEN',
  created_at: '',
  updated_at: '',
}

beforeEach(() => jest.clearAllMocks())

describe('MemberList', () => {
  it('renders all participants', () => {
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u1"
        onGroupUpdate={() => {}}
      />,
    )
    expect(screen.getByText(/Ana Lima/)).toBeInTheDocument()
    expect(screen.getByText(/Bruno Costa/)).toBeInTheDocument()
  })

  it('displays "Dono" badge next to the group owner', () => {
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u1"
        onGroupUpdate={() => {}}
      />,
    )
    expect(screen.getByText('Dono')).toBeInTheDocument()
  })

  it('displays Remove button for non-owners when the current user is the owner and status=OPEN', () => {
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u1"
        onGroupUpdate={() => {}}
      />,
    )
    expect(
      screen.getByRole('button', { name: /remover Bruno/i }),
    ).toBeInTheDocument()
  })

  it('does NOT display Remove buttons when the current user is not the owner', () => {
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u2"
        onGroupUpdate={() => {}}
      />,
    )
    expect(screen.queryByRole('button', { name: /remover/i })).toBeNull()
  })

  it('disables the Remove button when status != OPEN', () => {
    const matchedGroup = { ...baseGroup, status: 'MATCHED' as const }
    render(
      <MemberList
        group={matchedGroup}
        currentUserId="u1"
        onGroupUpdate={() => {}}
      />,
    )
    expect(
      screen.getByRole('button', { name: /remover Bruno/i }),
    ).toBeDisabled()
  })

  it('calls removeMember and fires onGroupUpdate on click', async () => {
    const updatedGroup = { ...baseGroup, users: [owner] }
    mockRemoveMember.mockResolvedValue(updatedGroup)
    const onGroupUpdate = jest.fn()
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u1"
        onGroupUpdate={onGroupUpdate}
      />,
    )
    await userEvent.click(
      screen.getByRole('button', { name: /remover Bruno/i }),
    )
    await waitFor(() =>
      expect(mockRemoveMember).toHaveBeenCalledWith('g1', 'u2'),
    )
    expect(onGroupUpdate).toHaveBeenCalledWith(updatedGroup)
  })

  it('displays error toast when remove fails', async () => {
    mockRemoveMember.mockRejectedValue(new Error('server error'))
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u1"
        onGroupUpdate={() => {}}
      />,
    )
    await userEvent.click(
      screen.getByRole('button', { name: /remover Bruno/i }),
    )
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Erro ao remover o participante.',
        type: 'error',
      }),
    )
  })

  it('each participant name is rendered as a clickable button (view profile)', () => {
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u1"
        onGroupUpdate={() => {}}
      />,
    )
    expect(
      screen.getByRole('button', { name: /ver perfil de Ana Lima/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ver perfil de Bruno Costa/i }),
    ).toBeInTheDocument()
  })

  it('clicking the name opens MemberProfileSheet with the correct user', async () => {
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u1"
        onGroupUpdate={() => {}}
      />,
    )
    await userEvent.click(
      screen.getByRole('button', { name: /ver perfil de Bruno Costa/i }),
    )
    const sheet = screen.getByTestId('member-profile-sheet')
    expect(sheet).toBeInTheDocument()
    expect(sheet).toHaveAttribute('data-userid', 'u2')
  })

  it('onClose of the sheet resets selectedUser (sheet hidden)', async () => {
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u1"
        onGroupUpdate={() => {}}
      />,
    )
    await userEvent.click(
      screen.getByRole('button', { name: /ver perfil de Bruno Costa/i }),
    )
    expect(screen.getByTestId('member-profile-sheet')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('button', { name: /fechar sheet/i }),
    )
    expect(screen.queryByTestId('member-profile-sheet')).toBeNull()
  })
})

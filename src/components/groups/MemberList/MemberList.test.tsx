import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as groupService from '@/services/api/groupService'
import type { Group, User } from '@/types/api'

import { MemberList } from './MemberList'

jest.mock('@/services/api/groupService', () => ({ removeMember: jest.fn() }))

const mockShowToast = jest.fn()
jest.mock('@/components/ui/Toast/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

jest.mock(
  '@/components/groups/MemberProfileSheet/MemberProfileSheet',
  () => ({
    MemberProfileSheet: ({
      userId,
      onClose,
    }: {
      userId: string | null
      onClose: () => void
    }) =>
      userId ? (
        <div data-testid="member-profile-sheet" data-userid={userId}>
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
  it('renderiza todos os participantes', () => {
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

  it('exibe badge "Dono" ao lado do dono do grupo', () => {
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u1"
        onGroupUpdate={() => {}}
      />,
    )
    expect(screen.getByText('Dono')).toBeInTheDocument()
  })

  it('exibe botão Remover para não-donos quando o usuário atual é o dono e status=OPEN', () => {
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

  it('NÃO exibe botões Remover quando o usuário atual não é o dono', () => {
    render(
      <MemberList
        group={baseGroup}
        currentUserId="u2"
        onGroupUpdate={() => {}}
      />,
    )
    expect(screen.queryByRole('button', { name: /remover/i })).toBeNull()
  })

  it('desabilita o botão Remover quando status != OPEN', () => {
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

  it('chama removeMember e dispara onGroupUpdate no clique', async () => {
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

  it('exibe toast de erro quando o remove falha', async () => {
    mockRemoveMember.mockRejectedValue(new Error('Falha ao remover.'))
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
        message: 'Falha ao remover.',
        type: 'error',
      }),
    )
  })

  it('cada nome de participante é renderizado como botão clicável (ver perfil)', () => {
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

  it('clique no nome abre o MemberProfileSheet com o userId correto', async () => {
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

  it('onClose do sheet zera selectedUserId (sheet escondido)', async () => {
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

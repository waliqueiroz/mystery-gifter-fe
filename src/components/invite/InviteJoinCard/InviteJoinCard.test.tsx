import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InviteJoinCard } from './InviteJoinCard'
import * as inviteService from '@/services/api/inviteService'

jest.mock('@/services/api/inviteService', () => ({ joinGroup: jest.fn() }))
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))

const mockJoinGroup = inviteService.joinGroup as jest.Mock

const mockGroup = {
  id: 'g1', name: 'Grupo', description: '', users: [], owner_id: 'u1',
  matches: [], status: 'OPEN' as const, created_at: '', updated_at: '',
}

beforeEach(() => jest.clearAllMocks())

describe('InviteJoinCard', () => {
  it('renders the join button', () => {
    render(<InviteJoinCard token="abc123" />)
    expect(screen.getByRole('button', { name: /entrar no grupo/i })).toBeInTheDocument()
  })

  it('calls joinGroup with the token on click', async () => {
    mockJoinGroup.mockResolvedValue(mockGroup)
    render(<InviteJoinCard token="abc123" />)
    await userEvent.click(screen.getByRole('button', { name: /entrar no grupo/i }))
    await waitFor(() => expect(mockJoinGroup).toHaveBeenCalledWith('abc123'))
  })

  it('shows draw_completed message when group is matched', async () => {
    mockJoinGroup.mockRejectedValue(new Error('group is already matched'))
    render(<InviteJoinCard token="tok" />)
    await userEvent.click(screen.getByRole('button', { name: /entrar no grupo/i }))
    expect(await screen.findByText(/sorteio deste grupo já foi realizado/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /entrar/i })).not.toBeInTheDocument()
  })

  it('shows invalid message when invite is not found', async () => {
    mockJoinGroup.mockRejectedValue(new Error('invite not found'))
    render(<InviteJoinCard token="tok" />)
    await userEvent.click(screen.getByRole('button', { name: /entrar no grupo/i }))
    expect(await screen.findByText(/inválido ou expirou/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /entrar/i })).not.toBeInTheDocument()
  })

  it('shows generic error message for unknown errors', async () => {
    mockJoinGroup.mockRejectedValue(new Error('server error'))
    render(<InviteJoinCard token="tok" />)
    await userEvent.click(screen.getByRole('button', { name: /entrar no grupo/i }))
    expect(await screen.findByText(/ocorreu um erro/i)).toBeInTheDocument()
  })
})

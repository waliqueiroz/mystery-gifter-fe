import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InviteSection } from './InviteSection'
import * as inviteService from '@/services/api/inviteService'
import type { GroupInvite } from '@/types/api'

jest.mock('@/services/api/inviteService', () => ({
  getActiveInvite: jest.fn(),
  createInvite: jest.fn(),
}))

const mockShowToast = jest.fn()
jest.mock('@/components/ui/Toast/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

const mockGetActiveInvite = inviteService.getActiveInvite as jest.Mock
const mockCreateInvite = inviteService.createInvite as jest.Mock

function makeInvite(id = 'inv-1'): GroupInvite {
  return { id, group_id: 'g1', expires_at: '', created_at: '' }
}

const NOT_FOUND_ERROR = new Error('Recurso não encontrado')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('InviteSection', () => {
  it('returns null when status is MATCHED', async () => {
    const { container } = render(
      <InviteSection groupId="g1" isOwner={true} groupStatus="MATCHED" />,
    )
    expect(container).toBeEmptyDOMElement()
    expect(mockGetActiveInvite).not.toHaveBeenCalled()
  })

  it('returns null when status is ARCHIVED', async () => {
    const { container } = render(
      <InviteSection groupId="g1" isOwner={true} groupStatus="ARCHIVED" />,
    )
    expect(container).toBeEmptyDOMElement()
    expect(mockGetActiveInvite).not.toHaveBeenCalled()
  })

  it('shows loading spinner initially', () => {
    mockGetActiveInvite.mockReturnValue(new Promise(() => {}))
    render(<InviteSection groupId="g1" isOwner={true} groupStatus="OPEN" />)
    expect(screen.getByRole('status', { name: /carregando convite/i })).toBeInTheDocument()
  })

  it('renders copy button when active invite exists', async () => {
    mockGetActiveInvite.mockResolvedValue(makeInvite())
    render(<InviteSection groupId="g1" isOwner={true} groupStatus="OPEN" />)
    expect(await screen.findByRole('button', { name: /copiar link/i })).toBeInTheDocument()
  })

  it('shows generate button for owner when no invite exists', async () => {
    mockGetActiveInvite.mockRejectedValue(NOT_FOUND_ERROR)
    render(<InviteSection groupId="g1" isOwner={true} groupStatus="OPEN" />)
    expect(await screen.findByRole('button', { name: /gerar link de convite/i })).toBeInTheDocument()
  })

  it('shows placeholder message for non-owner when no invite exists', async () => {
    mockGetActiveInvite.mockRejectedValue(NOT_FOUND_ERROR)
    render(<InviteSection groupId="g1" isOwner={false} groupStatus="OPEN" />)
    expect(await screen.findByText(/nenhum link de convite ativo/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /gerar link/i })).not.toBeInTheDocument()
  })

  it('copies invite URL to clipboard and shows success toast', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, writable: true })
    mockGetActiveInvite.mockResolvedValue(makeInvite('inv-abc'))
    render(<InviteSection groupId="g1" isOwner={true} groupStatus="OPEN" />)
    await screen.findByRole('button', { name: /copiar link/i })
    await userEvent.click(screen.getByRole('button', { name: /copiar link/i }))
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('/invite/inv-abc'))
    expect(mockShowToast).toHaveBeenCalledWith({ message: 'Link copiado!', type: 'success' })
  })

  it('shows error toast when clipboard copy fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockRejectedValue(new Error('denied')) },
      writable: true,
    })
    mockGetActiveInvite.mockResolvedValue(makeInvite())
    render(<InviteSection groupId="g1" isOwner={true} groupStatus="OPEN" />)
    await screen.findByRole('button', { name: /copiar link/i })
    await userEvent.click(screen.getByRole('button', { name: /copiar link/i }))
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error' }),
    )
  })

  it('generates invite and renders copy button', async () => {
    mockGetActiveInvite.mockRejectedValue(NOT_FOUND_ERROR)
    mockCreateInvite.mockResolvedValue(makeInvite('inv-new'))
    render(<InviteSection groupId="g1" isOwner={true} groupStatus="OPEN" />)
    await screen.findByRole('button', { name: /gerar link de convite/i })
    await userEvent.click(screen.getByRole('button', { name: /gerar link de convite/i }))
    expect(await screen.findByRole('button', { name: /copiar link/i })).toBeInTheDocument()
    expect(mockCreateInvite).toHaveBeenCalledWith('g1')
  })

  it('shows error toast when generate invite fails', async () => {
    mockGetActiveInvite.mockRejectedValue(NOT_FOUND_ERROR)
    mockCreateInvite.mockRejectedValue(new Error('Falha ao criar convite'))
    render(<InviteSection groupId="g1" isOwner={true} groupStatus="OPEN" />)
    await screen.findByRole('button', { name: /gerar link de convite/i })
    await userEvent.click(screen.getByRole('button', { name: /gerar link de convite/i }))
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Falha ao criar convite',
        type: 'error',
      }),
    )
  })

  it('calls getActiveInvite with the correct groupId', async () => {
    mockGetActiveInvite.mockResolvedValue(makeInvite())
    render(<InviteSection groupId="group-99" isOwner={true} groupStatus="OPEN" />)
    await waitFor(() =>
      expect(mockGetActiveInvite).toHaveBeenCalledWith('group-99'),
    )
  })
})

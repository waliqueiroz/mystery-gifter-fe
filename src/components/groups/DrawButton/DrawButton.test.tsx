import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DrawButton } from './DrawButton'
import * as groupService from '@/services/api/groupService'
import type { Group, User } from '@/types/api'

jest.mock('@/services/api/groupService', () => ({ generateDraw: jest.fn() }))

const mockShowToast = jest.fn()
jest.mock('@/components/ui/Toast/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

const mockGenerateDraw = groupService.generateDraw as jest.Mock

function makeUser(id: string): User {
  return { id, name: `User ${id}`, surname: 'Test', email: `${id}@e.com`, created_at: '', updated_at: '' }
}

function makeGroup(userCount: number, status: Group['status'] = 'OPEN'): Group {
  return {
    id: 'g1', name: 'Grupo', description: '',
    users: Array.from({ length: userCount }, (_, i) => makeUser(`u${i + 1}`)),
    owner_id: 'u1', matches: [], status,
    created_at: '', updated_at: '',
  }
}

beforeEach(() => jest.clearAllMocks())

describe('DrawButton', () => {
  it('renders the draw button', () => {
    render(<DrawButton group={makeGroup(3)} onGroupUpdate={() => {}} />)
    expect(screen.getByRole('button', { name: /realizar sorteio/i })).toBeInTheDocument()
  })

  it('is enabled when group has 3+ members and status is OPEN', () => {
    render(<DrawButton group={makeGroup(3)} onGroupUpdate={() => {}} />)
    expect(screen.getByRole('button', { name: /realizar sorteio/i })).not.toBeDisabled()
  })

  it('is disabled when fewer than 3 members', () => {
    render(<DrawButton group={makeGroup(2)} onGroupUpdate={() => {}} />)
    expect(screen.getByRole('button', { name: /realizar sorteio/i })).toBeDisabled()
  })

  it('shows inline message when fewer than 3 members and group is OPEN', () => {
    render(<DrawButton group={makeGroup(2)} onGroupUpdate={() => {}} />)
    expect(screen.getByText(/são necessários pelo menos 3 participantes/i)).toBeInTheDocument()
  })

  it('is disabled when status is not OPEN', () => {
    render(<DrawButton group={makeGroup(4, 'MATCHED')} onGroupUpdate={() => {}} />)
    expect(screen.getByRole('button', { name: /realizar sorteio/i })).toBeDisabled()
  })

  it('does not show the member count message when status is not OPEN', () => {
    render(<DrawButton group={makeGroup(2, 'MATCHED')} onGroupUpdate={() => {}} />)
    expect(screen.queryByText(/são necessários/i)).not.toBeInTheDocument()
  })

  it('calls generateDraw and fires onGroupUpdate on click', async () => {
    const matchedGroup = { ...makeGroup(3), status: 'MATCHED' as const }
    mockGenerateDraw.mockResolvedValue(matchedGroup)
    const onGroupUpdate = jest.fn()
    render(<DrawButton group={makeGroup(3)} onGroupUpdate={onGroupUpdate} />)
    await userEvent.click(screen.getByRole('button', { name: /realizar sorteio/i }))
    await waitFor(() => expect(mockGenerateDraw).toHaveBeenCalledWith('g1'))
    expect(onGroupUpdate).toHaveBeenCalledWith(matchedGroup)
  })

  it('shows error toast when draw fails', async () => {
    mockGenerateDraw.mockRejectedValue(new Error('Falha no sorteio.'))
    render(<DrawButton group={makeGroup(3)} onGroupUpdate={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /realizar sorteio/i }))
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({ message: 'Falha no sorteio.', type: 'error' }),
    )
  })
})

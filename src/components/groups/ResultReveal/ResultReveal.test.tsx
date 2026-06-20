import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResultReveal } from './ResultReveal'
import * as inviteService from '@/services/api/inviteService'
import type { User } from '@/types/api'

jest.mock('@/services/api/inviteService', () => ({ getUserMatch: jest.fn() }))

const mockGetUserMatch = inviteService.getUserMatch as jest.Mock

const recipient: User = {
  id: 'u2', name: 'Maria', surname: 'Santos',
  email: 'maria@e.com', created_at: '', updated_at: '',
}

beforeEach(() => jest.clearAllMocks())

describe('ResultReveal', () => {
  it('renders the reveal button on the front face', () => {
    render(<ResultReveal groupId="g1" />)
    expect(screen.getByRole('button', { name: /ver quem você presenteia/i })).toBeInTheDocument()
  })

  it('does not show recipient name before reveal', () => {
    render(<ResultReveal groupId="g1" />)
    expect(screen.queryByText(/maria santos/i)).not.toBeInTheDocument()
  })

  it('fetches the match and shows recipient name after reveal click', async () => {
    mockGetUserMatch.mockResolvedValue(recipient)
    render(<ResultReveal groupId="g1" />)
    await userEvent.click(screen.getByRole('button', { name: /ver quem você presenteia/i }))
    await waitFor(() => expect(mockGetUserMatch).toHaveBeenCalledWith('g1'))
    expect(await screen.findByText('Maria Santos')).toBeInTheDocument()
  })

  it('shows error message when fetch fails', async () => {
    mockGetUserMatch.mockRejectedValue(new Error('server error'))
    render(<ResultReveal groupId="g1" />)
    await userEvent.click(screen.getByRole('button', { name: /ver quem você presenteia/i }))
    expect(await screen.findByText('Erro ao carregar o resultado.')).toBeInTheDocument()
  })

  it('calls getUserMatch with the correct groupId', async () => {
    mockGetUserMatch.mockResolvedValue(recipient)
    render(<ResultReveal groupId="g42" />)
    await userEvent.click(screen.getByRole('button', { name: /ver quem você presenteia/i }))
    await waitFor(() => expect(mockGetUserMatch).toHaveBeenCalledWith('g42'))
  })
})

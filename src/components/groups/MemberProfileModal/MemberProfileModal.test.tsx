import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemberProfileModal } from './MemberProfileModal'
import * as userService from '@/services/api/userService'
import type { User } from '@/types/api'

jest.mock('@/services/api/userService', () => ({ getUserById: jest.fn() }))

const mockGetUserById = userService.getUserById as jest.Mock

const mockUser: User = {
  id: 'u1',
  name: 'Ana',
  surname: 'Lima',
  email: 'ana@example.com',
  created_at: '2025-01-15T12:00:00Z',
  updated_at: '2025-01-15T12:00:00Z',
}

beforeEach(() => jest.clearAllMocks())

describe('MemberProfileModal', () => {
  it('renders nothing when userId is null', () => {
    const { container } = render(<MemberProfileModal userId={null} onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows spinner while loading', () => {
    mockGetUserById.mockReturnValue(new Promise(() => {}))
    render(<MemberProfileModal userId="u1" onClose={() => {}} />)
    expect(screen.getByRole('status', { name: /carregando/i })).toBeInTheDocument()
  })

  it('shows user name, surname and email on successful fetch', async () => {
    mockGetUserById.mockResolvedValue(mockUser)
    render(<MemberProfileModal userId="u1" onClose={() => {}} />)
    await waitFor(() => expect(screen.getByText('Ana Lima')).toBeInTheDocument())
    expect(screen.getByText('ana@example.com')).toBeInTheDocument()
  })

  it('shows error message when fetch rejects', async () => {
    mockGetUserById.mockRejectedValue(new Error('Usuário não encontrado.'))
    render(<MemberProfileModal userId="u1" onClose={() => {}} />)
    await waitFor(() => expect(screen.getByText('Usuário não encontrado.')).toBeInTheDocument())
  })

  it('"Tentar novamente" button re-invokes getUserById', async () => {
    mockGetUserById
      .mockRejectedValueOnce(new Error('Falha.'))
      .mockResolvedValueOnce(mockUser)
    render(<MemberProfileModal userId="u1" onClose={() => {}} />)
    await waitFor(() => expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /tentar novamente/i }))
    await waitFor(() => expect(screen.getByText('Ana Lima')).toBeInTheDocument())
    expect(mockGetUserById).toHaveBeenCalledTimes(2)
  })

  it('close button calls onClose', async () => {
    mockGetUserById.mockResolvedValue(mockUser)
    const onClose = jest.fn()
    render(<MemberProfileModal userId="u1" onClose={onClose} />)
    await waitFor(() => expect(screen.getByRole('button', { name: /fechar/i })).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicking backdrop calls onClose', async () => {
    mockGetUserById.mockResolvedValue(mockUser)
    const onClose = jest.fn()
    render(<MemberProfileModal userId="u1" onClose={onClose} />)
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement
    await userEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

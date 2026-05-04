import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateGroupModal } from './CreateGroupModal'
import * as groupService from '@/services/api/groupService'
import type { Group } from '@/types/api'

jest.mock('@/services/api/groupService', () => ({ createGroup: jest.fn() }))

const mockShowToast = jest.fn()
jest.mock('@/components/ui/Toast/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

const mockCreateGroup = groupService.createGroup as jest.Mock

const mockGroup: Group = {
  id: 'g1',
  name: 'Amigo Secreto',
  description: '',
  users: [],
  owner_id: 'u1',
  matches: [],
  status: 'OPEN',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSuccess: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CreateGroupModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(<CreateGroupModal {...defaultProps} isOpen={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the form when isOpen is true', () => {
    render(<CreateGroupModal {...defaultProps} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do grupo')).toBeInTheDocument()
  })

  it('shows inline error when submitting with empty name', async () => {
    render(<CreateGroupModal {...defaultProps} />)
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))
    expect(await screen.findByText('O nome do grupo é obrigatório.')).toBeInTheDocument()
    expect(mockCreateGroup).not.toHaveBeenCalled()
  })

  it('calls createGroup with trimmed name on valid submit', async () => {
    mockCreateGroup.mockResolvedValue(mockGroup)
    render(<CreateGroupModal {...defaultProps} />)
    await userEvent.type(screen.getByLabelText('Nome do grupo'), '  Amigo Secreto  ')
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))
    await waitFor(() =>
      expect(mockCreateGroup).toHaveBeenCalledWith({ name: 'Amigo Secreto', description: undefined }),
    )
  })

  it('calls onSuccess and onClose after successful creation', async () => {
    mockCreateGroup.mockResolvedValue(mockGroup)
    const onSuccess = jest.fn()
    const onClose = jest.fn()
    render(<CreateGroupModal isOpen onClose={onClose} onSuccess={onSuccess} />)
    await userEvent.type(screen.getByLabelText('Nome do grupo'), 'Grupo Novo')
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(mockGroup))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows toast error on API failure', async () => {
    mockCreateGroup.mockRejectedValue(new Error('Erro no servidor.'))
    render(<CreateGroupModal {...defaultProps} />)
    await userEvent.type(screen.getByLabelText('Nome do grupo'), 'Grupo')
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({ message: 'Erro no servidor.', type: 'error' }),
    )
  })

  it('calls onClose when cancel button is clicked', async () => {
    const onClose = jest.fn()
    render(<CreateGroupModal isOpen onClose={onClose} onSuccess={jest.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('description is optional — submits without it', async () => {
    mockCreateGroup.mockResolvedValue(mockGroup)
    render(<CreateGroupModal {...defaultProps} />)
    await userEvent.type(screen.getByLabelText('Nome do grupo'), 'Grupo')
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))
    await waitFor(() =>
      expect(mockCreateGroup).toHaveBeenCalledWith({ name: 'Grupo', description: undefined }),
    )
  })
})

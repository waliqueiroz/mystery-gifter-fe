import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as groupService from '@/services/api/groupService'
import type { Group } from '@/types/api'

import { CreateGroupForm } from './CreateGroupForm'

jest.mock('@/services/api/groupService', () => ({ createGroup: jest.fn() }))

const mockShowToast = jest.fn()
jest.mock('@/components/ui/Toast/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

const mockCreateGroup = groupService.createGroup as jest.Mock

const mockGroup: Group = {
  id: 'g1',
  name: 'Família',
  description: 'Tema natal',
  status: 'OPEN',
  owner_id: 'u1',
  users: [],
  matches: [],
  created_at: '',
  updated_at: '',
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CreateGroupForm', () => {
  it('renders the form fields', () => {
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    expect(screen.getByLabelText('Nome do grupo')).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
  })

  it('renders Criar grupo and Cancelar buttons (pill-lg geometry)', () => {
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    const criar = screen.getByRole('button', { name: /criar grupo/i })
    const cancelar = screen.getByRole('button', { name: /cancelar/i })
    expect(criar).toHaveClass('rounded-pill-lg')
    expect(cancelar).toHaveClass('rounded-pill-lg')
  })

  it('displays inline error when name is empty on submit', async () => {
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))
    expect(
      await screen.findByText('O nome do grupo é obrigatório.'),
    ).toBeInTheDocument()
    expect(mockCreateGroup).not.toHaveBeenCalled()
  })

  it('clears the error when typing in the name field again', async () => {
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))
    await screen.findByText('O nome do grupo é obrigatório.')
    await userEvent.type(screen.getByLabelText('Nome do grupo'), 'F')
    expect(screen.queryByText('O nome do grupo é obrigatório.')).toBeNull()
  })

  it('calls createGroup with trimmed name and optional description', async () => {
    mockCreateGroup.mockResolvedValue(mockGroup)
    const onSuccess = jest.fn()
    render(<CreateGroupForm onSuccess={onSuccess} onCancel={jest.fn()} />)
    await userEvent.type(
      screen.getByLabelText('Nome do grupo'),
      '  Família  ',
    )
    await userEvent.type(screen.getByLabelText('Descrição'), 'Tema natal')
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))

    await waitFor(() =>
      expect(mockCreateGroup).toHaveBeenCalledWith({
        name: 'Família',
        description: 'Tema natal',
      }),
    )
    expect(onSuccess).toHaveBeenCalledWith(mockGroup)
  })

  it('sends description=undefined when empty', async () => {
    mockCreateGroup.mockResolvedValue(mockGroup)
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    await userEvent.type(screen.getByLabelText('Nome do grupo'), 'Família')
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))

    await waitFor(() =>
      expect(mockCreateGroup).toHaveBeenCalledWith({
        name: 'Família',
        description: undefined,
      }),
    )
  })

  it('displays toast and does NOT call onSuccess when createGroup fails', async () => {
    mockCreateGroup.mockRejectedValue(new Error('Falha no servidor.'))
    const onSuccess = jest.fn()
    render(<CreateGroupForm onSuccess={onSuccess} onCancel={jest.fn()} />)
    await userEvent.type(screen.getByLabelText('Nome do grupo'), 'Família')
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        message: 'Falha no servidor.',
        type: 'error',
      }),
    )
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('calls onCancel when clicking Cancelar', async () => {
    const onCancel = jest.fn()
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('respects maxLength=255 on the description textarea', () => {
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    expect(screen.getByLabelText('Descrição')).toHaveAttribute(
      'maxlength',
      '255',
    )
  })
})

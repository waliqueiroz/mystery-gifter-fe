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
  created_at: '',
  updated_at: '',
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CreateGroupForm', () => {
  it('renderiza os campos do formulário', () => {
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    expect(screen.getByLabelText('Nome do grupo')).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
  })

  it('renderiza os botões Criar grupo e Cancelar (geometria pill-lg)', () => {
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    const criar = screen.getByRole('button', { name: /criar grupo/i })
    const cancelar = screen.getByRole('button', { name: /cancelar/i })
    expect(criar).toHaveClass('rounded-pill-lg')
    expect(cancelar).toHaveClass('rounded-pill-lg')
  })

  it('exibe erro inline quando o nome está vazio no submit', async () => {
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))
    expect(
      await screen.findByText('O nome do grupo é obrigatório.'),
    ).toBeInTheDocument()
    expect(mockCreateGroup).not.toHaveBeenCalled()
  })

  it('limpa o erro ao digitar no nome novamente', async () => {
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))
    await screen.findByText('O nome do grupo é obrigatório.')
    await userEvent.type(screen.getByLabelText('Nome do grupo'), 'F')
    expect(screen.queryByText('O nome do grupo é obrigatório.')).toBeNull()
  })

  it('chama createGroup com nome trimado e description opcional', async () => {
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

  it('envia description=undefined quando vazia', async () => {
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

  it('exibe toast e NÃO chama onSuccess quando createGroup falha', async () => {
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

  it('chama onCancel ao clicar em Cancelar', async () => {
    const onCancel = jest.fn()
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('respeita maxLength=255 no textarea de descrição', () => {
    render(<CreateGroupForm onSuccess={jest.fn()} onCancel={jest.fn()} />)
    expect(screen.getByLabelText('Descrição')).toHaveAttribute(
      'maxlength',
      '255',
    )
  })
})

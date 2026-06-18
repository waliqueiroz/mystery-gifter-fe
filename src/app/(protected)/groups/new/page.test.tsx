import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as groupService from '@/services/api/groupService'
import type { Group } from '@/types/api'

import NewGroupPage from './page'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockShowToast = jest.fn()
jest.mock('@/components/ui/Toast/useToast', () => ({
  useToast: () => ({ showToast: mockShowToast }),
}))

jest.mock('@/services/api/groupService', () => ({ createGroup: jest.fn() }))
const mockCreateGroup = groupService.createGroup as jest.Mock

const mockGroup: Group = {
  id: 'g-42',
  name: 'Família',
  description: '',
  status: 'OPEN',
  owner_id: 'u1',
  users: [],
  created_at: '',
  updated_at: '',
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('NewGroupPage', () => {
  it('renderiza heading "Criar grupo" e CreateGroupForm', () => {
    render(<NewGroupPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Criar grupo' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do grupo')).toBeInTheDocument()
  })

  it('redireciona para /groups/[id] após criação bem-sucedida + dispara toast', async () => {
    mockCreateGroup.mockResolvedValue(mockGroup)
    render(<NewGroupPage />)
    await userEvent.type(screen.getByLabelText('Nome do grupo'), 'Família')
    await userEvent.click(screen.getByRole('button', { name: /criar grupo/i }))

    // Aguarda o efeito do onSuccess
    await screen.findByRole('heading', { name: 'Criar grupo' }) // sanity wait
    expect(mockPush).toHaveBeenCalledWith('/groups/g-42')
    expect(mockShowToast).toHaveBeenCalledWith({
      message: 'Grupo criado com sucesso!',
      type: 'success',
    })
  })

  it('clique em Cancelar navega de volta para /groups', async () => {
    render(<NewGroupPage />)
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(mockPush).toHaveBeenCalledWith('/groups')
  })
})

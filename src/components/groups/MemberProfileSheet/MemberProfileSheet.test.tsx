import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import * as userService from '@/services/api/userService'
import type { User } from '@/types/api'

import { MemberProfileSheet } from './MemberProfileSheet'

jest.mock('@/services/api/userService', () => ({ getUserById: jest.fn() }))
const mockGetUserById = userService.getUserById as jest.Mock

const mockUser: User = {
  id: 'u2',
  name: 'Maria',
  surname: 'Santos',
  email: 'maria@example.com',
  created_at: '',
  updated_at: '',
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('MemberProfileSheet', () => {
  it('NÃO renderiza dialog quando userId é null', () => {
    render(<MemberProfileSheet userId={null} onClose={jest.fn()} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renderiza dialog quando userId é informado', () => {
    mockGetUserById.mockReturnValue(new Promise(() => {}))
    render(<MemberProfileSheet userId="u2" onClose={jest.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('busca o usuário ao abrir', () => {
    mockGetUserById.mockResolvedValue(mockUser)
    render(<MemberProfileSheet userId="u2" onClose={jest.fn()} />)
    expect(mockGetUserById).toHaveBeenCalledWith('u2')
  })

  it('exibe os dados do membro após o load', async () => {
    mockGetUserById.mockResolvedValue(mockUser)
    render(<MemberProfileSheet userId="u2" onClose={jest.fn()} />)
    expect(await screen.findByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('maria@example.com')).toBeInTheDocument()
  })

  it('NÃO exibe spinner — exibe skeleton após o delay (FR-024)', () => {
    jest.useFakeTimers()
    try {
      mockGetUserById.mockReturnValue(new Promise(() => {}))
      render(<MemberProfileSheet userId="u2" onClose={jest.fn()} />)
      act(() => {
        jest.advanceTimersByTime(160)
      })
      // O BottomSheet usa Dialog.Portal do Radix → renderiza em document.body,
      // não em `container`. Consulta-se via document.
      expect(
        document.querySelectorAll('.react-loading-skeleton').length,
      ).toBeGreaterThan(0)
      expect(screen.queryByRole('status', { name: /carregando/i })).toBeNull()
    } finally {
      jest.useRealTimers()
    }
  })

  it('chama onClose ao clicar em Fechar do sheet', async () => {
    mockGetUserById.mockResolvedValue(mockUser)
    const onClose = jest.fn()
    render(<MemberProfileSheet userId="u2" onClose={onClose} />)
    await screen.findByText('Maria Santos')
    await userEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('chama onClose ao pressionar ESC', async () => {
    mockGetUserById.mockResolvedValue(mockUser)
    const onClose = jest.fn()
    render(<MemberProfileSheet userId="u2" onClose={onClose} />)
    await screen.findByText('Maria Santos')
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  describe('estado de erro', () => {
    it('exibe EmptyState variant="error" + retry quando o fetch falha', async () => {
      mockGetUserById.mockRejectedValue(new Error('Falha no servidor.'))
      render(<MemberProfileSheet userId="u2" onClose={jest.fn()} />)
      expect(
        await screen.findByText('Não foi possível carregar'),
      ).toBeInTheDocument()
      expect(screen.getByText('Falha no servidor.')).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /tentar novamente/i }),
      ).toBeInTheDocument()
    })

    it('refaz a busca ao clicar em "Tentar novamente"', async () => {
      mockGetUserById
        .mockRejectedValueOnce(new Error('Erro.'))
        .mockResolvedValueOnce(mockUser)
      render(<MemberProfileSheet userId="u2" onClose={jest.fn()} />)
      await screen.findByText('Não foi possível carregar')
      await userEvent.click(
        screen.getByRole('button', { name: /tentar novamente/i }),
      )
      expect(await screen.findByText('Maria Santos')).toBeInTheDocument()
    })
  })

  it('limpa os dados quando userId vira null (não vaza membro anterior)', async () => {
    mockGetUserById.mockResolvedValue(mockUser)
    const { rerender } = render(
      <MemberProfileSheet userId="u2" onClose={jest.fn()} />,
    )
    await screen.findByText('Maria Santos')

    rerender(<MemberProfileSheet userId={null} onClose={jest.fn()} />)
    expect(screen.queryByText('Maria Santos')).toBeNull()

    rerender(<MemberProfileSheet userId="u2" onClose={jest.fn()} />)
    // Estado anterior limpo; durante o re-fetch, NÃO mostra Maria
    expect(screen.queryByText('Maria Santos')).toBeNull()
    await waitFor(() => expect(mockGetUserById).toHaveBeenCalledTimes(2))
  })
})

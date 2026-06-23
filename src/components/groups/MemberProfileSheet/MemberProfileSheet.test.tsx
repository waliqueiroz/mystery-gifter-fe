import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { User } from '@/types/api'

import { MemberProfileSheet } from './MemberProfileSheet'

const mockUser: User = {
  id: 'u2',
  name: 'Maria',
  surname: 'Santos',
  email: 'maria@example.com',
  created_at: '',
  updated_at: '',
}

describe('MemberProfileSheet', () => {
  it('NÃO renderiza dialog quando user é null', () => {
    render(<MemberProfileSheet user={null} onClose={jest.fn()} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renderiza dialog quando user é informado', () => {
    render(<MemberProfileSheet user={mockUser} onClose={jest.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('exibe nome, sobrenome e email do membro', () => {
    render(<MemberProfileSheet user={mockUser} onClose={jest.fn()} />)
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('maria@example.com')).toBeInTheDocument()
  })

  it('chama onClose ao clicar em Fechar do sheet', async () => {
    const onClose = jest.fn()
    render(<MemberProfileSheet user={mockUser} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('chama onClose ao pressionar ESC', async () => {
    const onClose = jest.fn()
    render(<MemberProfileSheet user={mockUser} onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('fecha o sheet quando user vira null', () => {
    const { rerender } = render(
      <MemberProfileSheet user={mockUser} onClose={jest.fn()} />,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    rerender(<MemberProfileSheet user={null} onClose={jest.fn()} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})

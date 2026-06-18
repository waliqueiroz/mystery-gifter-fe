import { render, screen } from '@testing-library/react'

import { GroupEmptyState } from './GroupEmptyState'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('GroupEmptyState', () => {
  it('renderiza o título da lista vazia', () => {
    render(<GroupEmptyState />)
    expect(screen.getByText('Nenhum grupo ainda')).toBeInTheDocument()
  })

  it('renderiza o texto descritivo', () => {
    render(<GroupEmptyState />)
    expect(
      screen.getByText(/Crie seu primeiro grupo de Amigo Secreto/i),
    ).toBeInTheDocument()
  })

  it('renderiza o CTA "Criar grupo" como link para /groups/new', () => {
    render(<GroupEmptyState />)
    const link = screen.getByRole('link', { name: /criar grupo/i })
    expect(link).toHaveAttribute('href', '/groups/new')
  })
})

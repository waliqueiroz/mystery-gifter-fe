import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Icon } from '@/components/ui/Icon/Icon'

import { EmptyState } from './EmptyState'

const baseProps = {
  icon: <Icon name="Inbox" />,
  title: 'Nenhum grupo ainda',
}

describe('EmptyState', () => {
  it('renderiza ícone, title e expõe role="status"', () => {
    render(<EmptyState {...baseProps} />)
    expect(screen.getByText('Nenhum grupo ainda')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(document.querySelector('svg')).not.toBeNull()
  })

  it('exibe description quando passada', () => {
    render(
      <EmptyState
        {...baseProps}
        description="Crie seu primeiro grupo para começar."
      />,
    )
    expect(
      screen.getByText('Crie seu primeiro grupo para começar.'),
    ).toBeInTheDocument()
  })

  it('NÃO exibe description quando ausente', () => {
    const { container } = render(<EmptyState {...baseProps} />)
    expect(container.querySelectorAll('p').length).toBe(0)
  })

  describe('variant', () => {
    it('default aplica cor de texto branca no título', () => {
      render(<EmptyState {...baseProps} />)
      expect(screen.getByRole('heading')).toHaveClass('text-mg-text')
    })

    it('error aplica cor de erro no título e wrapper do ícone', () => {
      render(<EmptyState {...baseProps} variant="error" />)
      const heading = screen.getByRole('heading')
      expect(heading).toHaveClass('text-mg-text-negative')

      const iconWrapper = document.querySelector(
        '.bg-mg-text-negative\\/10',
      )
      expect(iconWrapper).not.toBeNull()
    })
  })

  describe('CTA', () => {
    it('sem cta NÃO renderiza botão (caso de borda do FR-025)', () => {
      render(<EmptyState {...baseProps} />)
      expect(screen.queryByRole('button')).toBeNull()
      expect(screen.queryByRole('link')).toBeNull()
    })

    it('com cta.onClick renderiza <button> e dispara onClick', async () => {
      const handle = jest.fn()
      render(
        <EmptyState
          {...baseProps}
          cta={{ label: 'Criar grupo', onClick: handle }}
        />,
      )
      const btn = screen.getByRole('button', { name: /criar grupo/i })
      expect(btn).toBeInTheDocument()
      await userEvent.click(btn)
      expect(handle).toHaveBeenCalledTimes(1)
    })

    it('com cta.href renderiza <Link> apontando para o href', () => {
      render(
        <EmptyState
          {...baseProps}
          cta={{ label: 'Criar grupo', href: '/groups/new' }}
        />,
      )
      const link = screen.getByRole('link', { name: /criar grupo/i })
      expect(link).toHaveAttribute('href', '/groups/new')
    })

    it('CTA segue geometria pill-lg + uppercase do botão', () => {
      render(
        <EmptyState
          {...baseProps}
          cta={{ label: 'Tentar novamente', onClick: () => {} }}
        />,
      )
      const btn = screen.getByRole('button', { name: /tentar novamente/i })
      expect(btn).toHaveClass('rounded-pill-lg')
      expect(btn).toHaveClass('uppercase')
    })
  })

  it('encaminha className adicional', () => {
    render(<EmptyState {...baseProps} className="my-8" />)
    expect(screen.getByRole('status')).toHaveClass('my-8')
  })
})

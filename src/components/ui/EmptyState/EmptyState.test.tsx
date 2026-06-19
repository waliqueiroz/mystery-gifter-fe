import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Icon } from '@/components/ui/Icon/Icon'

import { EmptyState } from './EmptyState'

const baseProps = {
  icon: <Icon name="Inbox" />,
  title: 'Nenhum grupo ainda',
}

describe('EmptyState', () => {
  it('renders icon, title and exposes role="status"', () => {
    render(<EmptyState {...baseProps} />)
    expect(screen.getByText('Nenhum grupo ainda')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(document.querySelector('svg')).not.toBeNull()
  })

  it('displays description when provided', () => {
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

  it('does NOT display description when absent', () => {
    const { container } = render(<EmptyState {...baseProps} />)
    expect(container.querySelectorAll('p').length).toBe(0)
  })

  describe('variant', () => {
    it('default applies white text color to the title', () => {
      render(<EmptyState {...baseProps} />)
      expect(screen.getByRole('heading')).toHaveClass('text-mg-text')
    })

    it('error applies error color to the title and icon wrapper', () => {
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
    it('without cta does NOT render button (edge case of FR-025)', () => {
      render(<EmptyState {...baseProps} />)
      expect(screen.queryByRole('button')).toBeNull()
      expect(screen.queryByRole('link')).toBeNull()
    })

    it('with cta.onClick renders <button> and fires onClick', async () => {
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

    it('with cta.href renders <Link> pointing to the href', () => {
      render(
        <EmptyState
          {...baseProps}
          cta={{ label: 'Criar grupo', href: '/groups/new' }}
        />,
      )
      const link = screen.getByRole('link', { name: /criar grupo/i })
      expect(link).toHaveAttribute('href', '/groups/new')
    })

    it('CTA follows pill-lg geometry + button uppercase', () => {
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

  it('forwards additional className', () => {
    render(<EmptyState {...baseProps} className="my-8" />)
    expect(screen.getByRole('status')).toHaveClass('my-8')
  })
})

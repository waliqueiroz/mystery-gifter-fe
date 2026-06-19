import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ErrorAlert } from './ErrorAlert'

describe('ErrorAlert', () => {
  it('renders the error message', () => {
    render(<ErrorAlert message="Algo deu errado." />)
    expect(screen.getByText('Algo deu errado.')).toBeInTheDocument()
  })

  it('exposes role="alert"', () => {
    render(<ErrorAlert message="x" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('applies border and text in mg-text-negative', () => {
    render(<ErrorAlert message="x" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('border-mg-text-negative')
    expect(alert).toHaveClass('text-mg-text-negative')
  })

  it('renders alert icon (not spinner)', () => {
    const { container } = render(<ErrorAlert message="x" />)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  describe('when onRetry is passed (legacy consumer)', () => {
    it('renders "Tentar novamente" button', () => {
      render(<ErrorAlert message="x" onRetry={() => {}} />)
      expect(
        screen.getByRole('button', { name: /tentar novamente/i }),
      ).toBeInTheDocument()
    })

    it('calls onRetry on click', async () => {
      const onRetry = jest.fn()
      render(<ErrorAlert message="x" onRetry={onRetry} />)
      await userEvent.click(
        screen.getByRole('button', { name: /tentar novamente/i }),
      )
      expect(onRetry).toHaveBeenCalledTimes(1)
    })

    it('button follows pill geometry (rounded-pill) and uppercase tracking typography', () => {
      render(<ErrorAlert message="x" onRetry={() => {}} />)
      const btn = screen.getByRole('button', { name: /tentar novamente/i })
      expect(btn).toHaveClass('rounded-pill')
      expect(btn).toHaveClass('uppercase')
      expect(btn).toHaveClass('tracking-btn')
    })
  })

  describe('when onRetry is NOT passed (inline form usage)', () => {
    it('does NOT render button', () => {
      render(<ErrorAlert message="Campo obrigatório." />)
      expect(screen.queryByRole('button')).toBeNull()
    })
  })

  it('forwards additional className', () => {
    render(<ErrorAlert message="x" className="mt-4" />)
    expect(screen.getByRole('alert')).toHaveClass('mt-4')
  })
})

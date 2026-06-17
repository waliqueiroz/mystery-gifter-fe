import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ErrorAlert } from './ErrorAlert'

describe('ErrorAlert', () => {
  it('renderiza a mensagem de erro', () => {
    render(<ErrorAlert message="Algo deu errado." />)
    expect(screen.getByText('Algo deu errado.')).toBeInTheDocument()
  })

  it('expõe role="alert"', () => {
    render(<ErrorAlert message="x" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('aplica borda e texto em mg-text-negative', () => {
    render(<ErrorAlert message="x" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('border-mg-text-negative')
    expect(alert).toHaveClass('text-mg-text-negative')
  })

  it('renderiza ícone de alerta (não spinner)', () => {
    const { container } = render(<ErrorAlert message="x" />)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  describe('quando onRetry é passado (consumidor legado)', () => {
    it('renderiza botão "Tentar novamente"', () => {
      render(<ErrorAlert message="x" onRetry={() => {}} />)
      expect(
        screen.getByRole('button', { name: /tentar novamente/i }),
      ).toBeInTheDocument()
    })

    it('chama onRetry ao clicar', async () => {
      const onRetry = jest.fn()
      render(<ErrorAlert message="x" onRetry={onRetry} />)
      await userEvent.click(
        screen.getByRole('button', { name: /tentar novamente/i }),
      )
      expect(onRetry).toHaveBeenCalledTimes(1)
    })

    it('botão segue geometria pill (rounded-pill) e tipografia uppercase tracking', () => {
      render(<ErrorAlert message="x" onRetry={() => {}} />)
      const btn = screen.getByRole('button', { name: /tentar novamente/i })
      expect(btn).toHaveClass('rounded-pill')
      expect(btn).toHaveClass('uppercase')
      expect(btn).toHaveClass('tracking-btn')
    })
  })

  describe('quando onRetry NÃO é passado (uso inline em formulário)', () => {
    it('NÃO renderiza botão', () => {
      render(<ErrorAlert message="Campo obrigatório." />)
      expect(screen.queryByRole('button')).toBeNull()
    })
  })

  it('encaminha className adicional', () => {
    render(<ErrorAlert message="x" className="mt-4" />)
    expect(screen.getByRole('alert')).toHaveClass('mt-4')
  })
})

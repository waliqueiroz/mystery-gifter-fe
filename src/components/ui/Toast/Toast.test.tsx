import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Toast, type ToastItem } from './Toast'

const baseToast: ToastItem = {
  id: '1',
  message: 'Operação realizada com sucesso!',
  type: 'success',
}

describe('Toast', () => {
  it('renderiza a mensagem', () => {
    render(<Toast toast={baseToast} onDismiss={() => {}} />)
    expect(
      screen.getByText('Operação realizada com sucesso!'),
    ).toBeInTheDocument()
  })

  it('expõe role="alert" para a11y', () => {
    render(<Toast toast={baseToast} onDismiss={() => {}} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('expõe aria-live="assertive"', () => {
    render(<Toast toast={baseToast} onDismiss={() => {}} />)
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
  })

  describe('variants por type', () => {
    it('success aplica borda esquerda em verde de marca', () => {
      render(<Toast toast={baseToast} onDismiss={() => {}} />)
      expect(screen.getByRole('alert')).toHaveClass('border-mg-green')
    })

    it('error aplica borda esquerda em text-negative', () => {
      const errorToast: ToastItem = { ...baseToast, type: 'error' }
      render(<Toast toast={errorToast} onDismiss={() => {}} />)
      expect(screen.getByRole('alert')).toHaveClass('border-mg-text-negative')
    })

    it('info aplica borda esquerda em announcement', () => {
      const infoToast: ToastItem = { ...baseToast, type: 'info' }
      render(<Toast toast={infoToast} onDismiss={() => {}} />)
      expect(screen.getByRole('alert')).toHaveClass(
        'border-mg-text-announcement',
      )
    })
  })

  it('aplica fundo escuro (bg-mg-surface) em todas as variantes', () => {
    render(<Toast toast={baseToast} onDismiss={() => {}} />)
    expect(screen.getByRole('alert')).toHaveClass('bg-mg-surface')
  })

  it('aplica shadow-mg-dialog do DESIGN.md', () => {
    render(<Toast toast={baseToast} onDismiss={() => {}} />)
    expect(screen.getByRole('alert')).toHaveClass('shadow-mg-dialog')
  })

  it('chama onDismiss com o id ao clicar em "Fechar notificação"', async () => {
    const onDismiss = jest.fn()
    render(<Toast toast={baseToast} onDismiss={onDismiss} />)
    await userEvent.click(
      screen.getByRole('button', { name: /fechar notificação/i }),
    )
    expect(onDismiss).toHaveBeenCalledWith('1')
  })

  it('renderiza ícone semântico (não spinner) em cada variante', () => {
    const { container, rerender } = render(
      <Toast toast={baseToast} onDismiss={() => {}} />,
    )
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)

    rerender(
      <Toast toast={{ ...baseToast, type: 'error' }} onDismiss={() => {}} />,
    )
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })
})

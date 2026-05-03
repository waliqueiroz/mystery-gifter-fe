import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider } from './ToastProvider'
import { useToast } from './useToast'

function TestConsumer({ type = 'success' as const }) {
  const { showToast } = useToast()
  return (
    <button onClick={() => showToast({ message: 'Teste', type })}>
      Mostrar toast
    </button>
  )
}

describe('ToastProvider', () => {
  it('renders children', () => {
    render(
      <ToastProvider>
        <span>conteúdo</span>
      </ToastProvider>,
    )
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('shows a toast when showToast is called', async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: /mostrar toast/i }))
    expect(screen.getByText('Teste')).toBeInTheDocument()
  })

  it('auto-dismisses the toast after 4 seconds', async () => {
    jest.useFakeTimers()
    const user = userEvent.setup({ delay: null })

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    )
    await user.click(screen.getByRole('button', { name: /mostrar toast/i }))
    expect(screen.getByText('Teste')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(4000)
    })

    expect(screen.queryByText('Teste')).not.toBeInTheDocument()
    jest.useRealTimers()
  })

  it('dismisses a toast manually via close button', async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: /mostrar toast/i }))
    await userEvent.click(screen.getByRole('button', { name: /fechar notificação/i }))
    expect(screen.queryByText('Teste')).not.toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast } from './Toast'
import type { ToastItem } from './Toast'

const mockToast: ToastItem = {
  id: '1',
  message: 'Operação realizada com sucesso!',
  type: 'success',
}

describe('Toast', () => {
  it('renders the message', () => {
    render(<Toast toast={mockToast} onDismiss={() => {}} />)
    expect(screen.getByText('Operação realizada com sucesso!')).toBeInTheDocument()
  })

  it('applies success bg class for type success', () => {
    const { container } = render(<Toast toast={mockToast} onDismiss={() => {}} />)
    expect(container.firstChild).toHaveClass('bg-success')
  })

  it('applies error bg class for type error', () => {
    const errorToast: ToastItem = { ...mockToast, type: 'error' }
    const { container } = render(<Toast toast={errorToast} onDismiss={() => {}} />)
    expect(container.firstChild).toHaveClass('bg-danger')
  })

  it('applies info bg class for type info', () => {
    const infoToast: ToastItem = { ...mockToast, type: 'info' }
    const { container } = render(<Toast toast={infoToast} onDismiss={() => {}} />)
    expect(container.firstChild).toHaveClass('bg-info')
  })

  it('calls onDismiss with the toast id when close button is clicked', async () => {
    const onDismiss = jest.fn()
    render(<Toast toast={mockToast} onDismiss={onDismiss} />)
    await userEvent.click(screen.getByRole('button', { name: /fechar notificação/i }))
    expect(onDismiss).toHaveBeenCalledWith('1')
  })

  it('has role="alert" for accessibility', () => {
    render(<Toast toast={mockToast} onDismiss={() => {}} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

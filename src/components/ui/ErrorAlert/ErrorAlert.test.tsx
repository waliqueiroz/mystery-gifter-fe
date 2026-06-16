import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorAlert } from './ErrorAlert'

describe('ErrorAlert', () => {
  it('renders the error message', () => {
    render(<ErrorAlert message="Algo deu errado." onRetry={() => {}} />)
    expect(screen.getByText('Algo deu errado.')).toBeInTheDocument()
  })

  it('renders a "Tentar novamente" button', () => {
    render(<ErrorAlert message="Erro." onRetry={() => {}} />)
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })

  it('calls onRetry when the button is clicked', async () => {
    const onRetry = jest.fn()
    render(<ErrorAlert message="Erro." onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: /tentar novamente/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders with alert role', () => {
    render(<ErrorAlert message="Erro." onRetry={() => {}} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

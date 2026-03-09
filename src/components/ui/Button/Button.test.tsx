import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Entrar</Button>)
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('applies btn-primary class by default', () => {
    render(<Button>Entrar</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-primary')
  })

  it('applies the correct variant class', () => {
    render(<Button variant="danger">Excluir</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn-danger')
  })

  it('shows loading spinner and disables button when loading=true', () => {
    render(<Button loading>Salvando</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByLabelText('Carregando')).toBeInTheDocument()
  })

  it('disables button when disabled=true', () => {
    render(<Button disabled>Entrar</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Entrar</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn()
    render(
      <Button disabled onClick={handleClick}>
        Entrar
      </Button>
    )
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', async () => {
    const handleClick = jest.fn()
    render(
      <Button loading onClick={handleClick}>
        Salvando
      </Button>
    )
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})

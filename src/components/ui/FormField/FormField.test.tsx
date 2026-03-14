import { render, screen } from '@testing-library/react'
import FormField from './FormField'

const defaultProps = {
  id: 'email',
  label: 'E-mail',
  value: '',
  onChange: jest.fn(),
}

describe('FormField', () => {
  it('renders the label', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByText('E-mail')).toBeInTheDocument()
  })

  it('renders the input with correct id', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email')
  })

  it('renders input with default type text', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
  })

  it('shows error message when error prop is provided', () => {
    render(<FormField {...defaultProps} error="Campo obrigatório" />)
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveClass('is-invalid')
  })

  it('does not show error message when error prop is absent', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox')).not.toHaveClass('is-invalid')
  })

  it('renders placeholder when provided', () => {
    render(<FormField {...defaultProps} placeholder="Digite seu e-mail" />)
    expect(screen.getByPlaceholderText('Digite seu e-mail')).toBeInTheDocument()
  })
})

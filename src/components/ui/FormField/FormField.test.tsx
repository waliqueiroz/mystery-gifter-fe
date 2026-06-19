import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FormField from './FormField'

const defaultProps = {
  id: 'email',
  label: 'E-mail',
  value: '',
  onChange: jest.fn(),
}

describe('FormField', () => {
  beforeEach(() => {
    defaultProps.onChange.mockClear()
  })

  it('renders the label associated with the input', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('renders the input with the provided id', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email')
  })

  it('default type é text', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
  })

  it('accepts custom type', () => {
    render(<FormField {...defaultProps} type="email" />)
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email')
  })

  it('applies the received value', () => {
    render(<FormField {...defaultProps} value="hello@example.com" />)
    expect(screen.getByRole('textbox')).toHaveValue('hello@example.com')
  })

  it('calls onChange with the string (not the event)', async () => {
    render(<FormField {...defaultProps} value="" />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(defaultProps.onChange).toHaveBeenCalledWith('a')
  })

  it('renders placeholder', () => {
    render(<FormField {...defaultProps} placeholder="Digite seu e-mail" />)
    expect(
      screen.getByPlaceholderText('Digite seu e-mail'),
    ).toBeInTheDocument()
  })

  it('applies pill visual (rounded-pill-lg) and surface background', () => {
    render(<FormField {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('rounded-pill-lg')
    expect(input).toHaveClass('bg-mg-surface-2')
  })

  it('applies inset shadow from DESIGN.md', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByRole('textbox')).toHaveClass('shadow-mg-inset')
  })

  describe('error state', () => {
    it('displays the error message below the input', () => {
      render(<FormField {...defaultProps} error="Campo obrigatório" />)
      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
    })

    it('marks the input with aria-invalid=true and error color', () => {
      render(<FormField {...defaultProps} error="x" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveClass('border-mg-text-negative')
    })

    it('associates aria-describedby with the error message id', () => {
      render(<FormField {...defaultProps} error="Campo obrigatório" />)
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'email-error',
      )
    })

    it('does NOT display helperText when there is an error', () => {
      render(
        <FormField
          {...defaultProps}
          error="Erro"
          helperText="Dica útil"
        />,
      )
      expect(screen.queryByText('Dica útil')).not.toBeInTheDocument()
    })
  })

  describe('helperText', () => {
    it('displays helperText below the input when there is no error', () => {
      render(<FormField {...defaultProps} helperText="Dica útil" />)
      expect(screen.getByText('Dica útil')).toBeInTheDocument()
    })

    it('associates aria-describedby with the helperText id', () => {
      render(<FormField {...defaultProps} helperText="Dica" />)
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'email-help',
      )
    })
  })

  describe('required', () => {
    it('marks the input as required and displays asterisk in the label', () => {
      render(<FormField {...defaultProps} required />)
      expect(screen.getByRole('textbox')).toBeRequired()
      expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('disabled', () => {
    it('marks the input as disabled', () => {
      render(<FormField {...defaultProps} disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })
  })

  describe('extra attributes', () => {
    it('forwards autoComplete', () => {
      render(<FormField {...defaultProps} autoComplete="email" />)
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'autocomplete',
        'email',
      )
    })

    it('forwards inputMode', () => {
      render(<FormField {...defaultProps} inputMode="numeric" />)
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'inputmode',
        'numeric',
      )
    })
  })
})

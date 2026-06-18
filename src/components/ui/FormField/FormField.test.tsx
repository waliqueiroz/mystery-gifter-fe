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

  it('renderiza o label associado ao input', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('renderiza o input com id fornecido', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email')
  })

  it('default type é text', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
  })

  it('aceita type customizado', () => {
    render(<FormField {...defaultProps} type="email" />)
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email')
  })

  it('aplica o valor recebido', () => {
    render(<FormField {...defaultProps} value="hello@example.com" />)
    expect(screen.getByRole('textbox')).toHaveValue('hello@example.com')
  })

  it('chama onChange com a string (não o evento)', async () => {
    render(<FormField {...defaultProps} value="" />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(defaultProps.onChange).toHaveBeenCalledWith('a')
  })

  it('renderiza placeholder', () => {
    render(<FormField {...defaultProps} placeholder="Digite seu e-mail" />)
    expect(
      screen.getByPlaceholderText('Digite seu e-mail'),
    ).toBeInTheDocument()
  })

  it('aplica visual pill (rounded-pill-lg) e fundo de superfície', () => {
    render(<FormField {...defaultProps} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('rounded-pill-lg')
    expect(input).toHaveClass('bg-mg-surface-2')
  })

  it('aplica inset shadow do DESIGN.md', () => {
    render(<FormField {...defaultProps} />)
    expect(screen.getByRole('textbox')).toHaveClass('shadow-mg-inset')
  })

  describe('estado de erro', () => {
    it('exibe a mensagem de erro abaixo do input', () => {
      render(<FormField {...defaultProps} error="Campo obrigatório" />)
      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
    })

    it('marca o input com aria-invalid=true e cor de erro', () => {
      render(<FormField {...defaultProps} error="x" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveClass('border-mg-text-negative')
    })

    it('associa aria-describedby ao id da mensagem de erro', () => {
      render(<FormField {...defaultProps} error="Campo obrigatório" />)
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'email-error',
      )
    })

    it('NÃO exibe helperText quando há error', () => {
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
    it('exibe helperText abaixo do input quando não há erro', () => {
      render(<FormField {...defaultProps} helperText="Dica útil" />)
      expect(screen.getByText('Dica útil')).toBeInTheDocument()
    })

    it('associa aria-describedby ao id do helperText', () => {
      render(<FormField {...defaultProps} helperText="Dica" />)
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'email-help',
      )
    })
  })

  describe('required', () => {
    it('marca o input como required e exibe asterisco no label', () => {
      render(<FormField {...defaultProps} required />)
      expect(screen.getByRole('textbox')).toBeRequired()
      expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('disabled', () => {
    it('marca o input como disabled', () => {
      render(<FormField {...defaultProps} disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })
  })

  describe('atributos extras', () => {
    it('encaminha autoComplete', () => {
      render(<FormField {...defaultProps} autoComplete="email" />)
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'autocomplete',
        'email',
      )
    })

    it('encaminha inputMode', () => {
      render(<FormField {...defaultProps} inputMode="numeric" />)
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'inputmode',
        'numeric',
      )
    })
  })
})

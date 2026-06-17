import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ConfirmModal } from './ConfirmModal'

const baseProps = {
  open: true,
  onOpenChange: jest.fn(),
  title: 'Confirmar ação',
  body: 'Tem certeza que deseja prosseguir?',
  confirmLabel: 'Confirmar',
  onConfirm: jest.fn(),
}

describe('ConfirmModal', () => {
  beforeEach(() => {
    baseProps.onOpenChange.mockClear()
    baseProps.onConfirm.mockClear()
  })

  it('não renderiza quando open=false', () => {
    render(<ConfirmModal {...baseProps} open={false} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renderiza title e body quando open=true', () => {
    render(<ConfirmModal {...baseProps} />)
    expect(screen.getByText('Confirmar ação')).toBeInTheDocument()
    expect(
      screen.getByText('Tem certeza que deseja prosseguir?'),
    ).toBeInTheDocument()
  })

  it('expõe role="dialog" via Radix', () => {
    render(<ConfirmModal {...baseProps} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renderiza confirmLabel e cancelLabel default "Cancelar"', () => {
    render(<ConfirmModal {...baseProps} />)
    expect(
      screen.getByRole('button', { name: /confirmar/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /cancelar/i }),
    ).toBeInTheDocument()
  })

  it('aceita cancelLabel customizado', () => {
    render(<ConfirmModal {...baseProps} cancelLabel="Não" />)
    expect(screen.getByRole('button', { name: /não/i })).toBeInTheDocument()
  })

  it('chama onConfirm ao clicar no botão de confirmação', async () => {
    render(<ConfirmModal {...baseProps} />)
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(baseProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('chama onCancel e fecha (onOpenChange=false) ao clicar em Cancelar', async () => {
    const onCancel = jest.fn()
    render(<ConfirmModal {...baseProps} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(baseProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('fecha (onOpenChange=false) ao clicar em Cancelar mesmo sem onCancel', async () => {
    render(<ConfirmModal {...baseProps} />)
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(baseProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  describe('estado loading', () => {
    it('desabilita ambos os botões quando isLoading=true', () => {
      render(<ConfirmModal {...baseProps} isLoading />)
      // Durante o loading, o texto "Confirmar" some (skeleton ocupa o lugar);
      // localizamos pelo número de botões e pelo aria-busy.
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
      buttons.forEach((btn) => expect(btn).toBeDisabled())
      expect(buttons.some((btn) => btn.getAttribute('aria-busy') === 'true')).toBe(true)
    })

    it('substitui texto do botão de confirmação por skeleton (sem spinner)', () => {
      render(<ConfirmModal {...baseProps} isLoading />)
      expect(document.querySelector('.react-loading-skeleton')).not.toBeNull()
      expect(screen.queryByRole('status')).toBeNull()
    })
  })

  describe('variante destructive', () => {
    it('aplica borda e texto em mg-text-negative no botão de confirmação', () => {
      render(<ConfirmModal {...baseProps} destructive />)
      const confirm = screen.getByRole('button', { name: /confirmar/i })
      expect(confirm).toHaveClass('text-mg-text-negative')
      expect(confirm).toHaveClass('border-mg-text-negative')
    })

    it('sem destructive (default), confirmação usa primary (verde de marca)', () => {
      render(<ConfirmModal {...baseProps} />)
      const confirm = screen.getByRole('button', { name: /confirmar/i })
      expect(confirm).toHaveClass('bg-mg-green')
    })
  })

  it('fecha ao pressionar ESC (a11y nativa do Radix)', async () => {
    render(<ConfirmModal {...baseProps} />)
    await userEvent.keyboard('{Escape}')
    expect(baseProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('aplica shadow-mg-dialog no painel do diálogo', () => {
    render(<ConfirmModal {...baseProps} />)
    expect(screen.getByRole('dialog')).toHaveClass('shadow-mg-dialog')
  })
})

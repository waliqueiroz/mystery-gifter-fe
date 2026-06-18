import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BottomSheet } from './BottomSheet'

const baseProps = {
  open: true,
  onOpenChange: jest.fn(),
  title: 'Detalhes do membro',
  children: <p>conteúdo do sheet</p>,
}

describe('BottomSheet', () => {
  beforeEach(() => {
    baseProps.onOpenChange.mockClear()
  })

  it('não renderiza quando open=false', () => {
    render(<BottomSheet {...baseProps} open={false} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renderiza title e children quando open=true', () => {
    render(<BottomSheet {...baseProps} />)
    expect(screen.getByText('Detalhes do membro')).toBeInTheDocument()
    expect(screen.getByText('conteúdo do sheet')).toBeInTheDocument()
  })

  it('expõe role="dialog" via Radix', () => {
    render(<BottomSheet {...baseProps} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renderiza description quando fornecida', () => {
    render(
      <BottomSheet {...baseProps} description="Informações adicionais" />,
    )
    expect(screen.getByText('Informações adicionais')).toBeInTheDocument()
  })

  it('NÃO renderiza description quando ausente', () => {
    render(<BottomSheet {...baseProps} />)
    expect(screen.queryByText('Informações adicionais')).toBeNull()
  })

  it('aplica fundo de superfície, cantos arredondados só no topo e shadow-mg-dialog', () => {
    render(<BottomSheet {...baseProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('bg-mg-surface')
    expect(dialog).toHaveClass('rounded-t-card')
    expect(dialog).toHaveClass('shadow-mg-dialog')
  })

  it('ancora no fim inferior em todas as larguras', () => {
    render(<BottomSheet {...baseProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('fixed')
    expect(dialog).toHaveClass('bottom-0')
    expect(dialog).toHaveClass('inset-x-0')
  })

  it('limita altura a 80vh e habilita rolagem interna', () => {
    render(<BottomSheet {...baseProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('class')).toContain('max-h-[80vh]')
    expect(dialog).toHaveClass('overflow-y-auto')
  })

  it('respeita safe-area-inset-bottom para não conflitar com home indicator', () => {
    render(<BottomSheet {...baseProps} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('class')).toContain('env(safe-area-inset-bottom)')
  })

  it('renderiza botão "Fechar" no canto superior direito', () => {
    render(<BottomSheet {...baseProps} />)
    expect(
      screen.getByRole('button', { name: /fechar/i }),
    ).toBeInTheDocument()
  })

  it('botão "Fechar" dispara onOpenChange(false)', async () => {
    render(<BottomSheet {...baseProps} />)
    await userEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(baseProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('ESC fecha o sheet (a11y nativa do Radix)', async () => {
    render(<BottomSheet {...baseProps} />)
    await userEvent.keyboard('{Escape}')
    expect(baseProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renderiza drag handle decorativo no topo', () => {
    render(<BottomSheet {...baseProps} />)
    const dialog = screen.getByRole('dialog')
    const handle = dialog.querySelector('[aria-hidden="true"]')
    expect(handle).not.toBeNull()
  })
})

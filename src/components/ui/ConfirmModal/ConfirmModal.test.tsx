import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmModal } from './ConfirmModal'

describe('ConfirmModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmModal isOpen={false} message="Tem certeza?" onConfirm={() => {}} onCancel={() => {}} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the message when isOpen is true', () => {
    render(
      <ConfirmModal isOpen message="Tem certeza?" onConfirm={() => {}} onCancel={() => {}} />,
    )
    expect(screen.getByText('Tem certeza?')).toBeInTheDocument()
  })

  it('shows default button labels', () => {
    render(
      <ConfirmModal isOpen message="Tem certeza?" onConfirm={() => {}} onCancel={() => {}} />,
    )
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('shows custom button labels', () => {
    render(
      <ConfirmModal
        isOpen
        message="Tem certeza?"
        confirmLabel="Sim, arquivar"
        cancelLabel="Não"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    )
    expect(screen.getByRole('button', { name: /sim, arquivar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /não/i })).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = jest.fn()
    render(
      <ConfirmModal isOpen message="Tem certeza?" onConfirm={onConfirm} onCancel={() => {}} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = jest.fn()
    render(
      <ConfirmModal isOpen message="Tem certeza?" onConfirm={() => {}} onCancel={onCancel} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('has role="dialog" for accessibility', () => {
    render(
      <ConfirmModal isOpen message="Tem certeza?" onConfirm={() => {}} onCancel={() => {}} />,
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

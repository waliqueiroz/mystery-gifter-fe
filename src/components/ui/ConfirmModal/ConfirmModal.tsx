'use client'

import * as Dialog from '@radix-ui/react-dialog'

import Button from '@/components/ui/Button/Button'
import { cn } from '@/lib/cn'

interface ConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  body: React.ReactNode
  confirmLabel: string
  cancelLabel?: string
  /**
   * Quando true, o botão de confirmação assume a variante outline +
   * `text-mg-text-negative` para sinalizar ação destrutiva (excluir, sair).
   * Sem esta prop, a confirmação usa o verde de marca (CTA primário) —
   * apropriado para ações irreversíveis mas positivas (ex.: sortear).
   */
  destructive?: boolean
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  /**
   * Quando true, desabilita ambos os botões e troca o conteúdo do botão
   * de confirmação por skeleton — usado enquanto onConfirm() está em vôo
   * para evitar duplo-clique.
   */
  isLoading?: boolean
}

/**
 * Único modal permitido no produto (FR-023 + PR-011): confirmação de ações
 * destrutivas/irreversíveis. Para qualquer outro fluxo (criação, edição,
 * visualização) usar rota dedicada ou BottomSheet.
 *
 * Implementado sobre `@radix-ui/react-dialog` para a11y nativa (focus trap,
 * ESC para fechar, role=dialog, aria-modal, aria-labelledby/describedby).
 */
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  body,
  confirmLabel,
  cancelLabel = 'Cancelar',
  destructive = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  function handleCancel() {
    onCancel?.()
    onOpenChange(false)
  }

  async function handleConfirm() {
    await onConfirm()
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-40 bg-black/60',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          )}
        />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md',
            '-translate-x-1/2 -translate-y-1/2',
            'rounded-card bg-mg-surface p-6 shadow-mg-dialog',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          )}
        >
          <Dialog.Title className="text-lg font-bold text-mg-text">
            {title}
          </Dialog.Title>
          <Dialog.Description asChild>
            <div className="mt-2 text-sm text-mg-text-muted">{body}</div>
          </Dialog.Description>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              shape="pill-lg"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={destructive ? 'outline' : 'primary'}
              shape="pill-lg"
              onClick={handleConfirm}
              loading={isLoading}
              className={destructive ? 'text-mg-text-negative border-mg-text-negative' : undefined}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

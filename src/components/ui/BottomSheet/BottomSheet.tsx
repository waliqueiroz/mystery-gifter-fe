'use client'

import * as Dialog from '@radix-ui/react-dialog'

import { Icon } from '@/components/ui/Icon/Icon'
import { cn } from '@/lib/cn'

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Anunciado para leitores de tela como o título do sheet. */
  title: string
  /** Texto auxiliar opcional, lido após o título. */
  description?: string
  children: React.ReactNode
}

/**
 * Painel deslizante read-only para visualização rápida — o substituto
 * canônico de modais não-confirmatórios para detalhes (FR-023 + Q2 da
 * clarificação).
 *
 * Implementado sobre `@radix-ui/react-dialog` (mesma base do
 * `ConfirmModal`) para herdar a11y: focus trap, ESC para fechar,
 * `role="dialog"`, `aria-modal`, `aria-labelledby/describedby` via
 * `Dialog.Title`/`Dialog.Description`.
 *
 * Geometria:
 *   - Slide a partir do fim inferior (`translate-y-full → 0`)
 *   - `rounded-t-card` (apenas cantos superiores)
 *   - Drag handle visual no topo (puramente decorativo nesta v1; gesto de
 *    drag-to-dismiss é opcional e pode entrar em iteração futura)
 *   - Limita altura a 80vh e habilita scroll interno quando o conteúdo
 *     excede
 *
 * NÃO usar para formulários ou fluxos multi-passo — esses devem ser rota
 * dedicada (Q2 + FR-023 + contracts/ui-primitives.md §4).
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: BottomSheetProps) {
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
            'fixed inset-x-0 bottom-0 z-50',
            'max-h-[80vh] overflow-y-auto',
            'rounded-t-card bg-mg-surface px-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-3',
            'shadow-mg-dialog',
            'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom',
            'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom',
          )}
        >
          {/* Drag handle visual — assina o gesto sem implementá-lo. */}
          <div
            aria-hidden="true"
            className="mx-auto mb-4 h-1 w-12 rounded-full bg-mg-border"
          />

          <div className="flex items-start justify-between gap-3">
            <div className="flex-grow">
              <Dialog.Title className="text-lg font-bold text-mg-text">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-sm text-mg-text-muted">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Fechar"
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                'text-mg-text-muted hover:text-mg-text hover:bg-mg-surface-2/60',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2',
              )}
            >
              <Icon name="X" size={18} aria-hidden />
            </Dialog.Close>
          </div>

          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

'use client'

import { Icon, type IconName } from '@/components/ui/Icon/Icon'
import { cn } from '@/lib/cn'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastProps {
  toast: ToastItem
  onDismiss: (id: string) => void
}

const TYPE_CLASSES: Record<ToastType, string> = {
  // Verde de marca aplicado funcionalmente em sucesso (notificação positiva
  // é um sinal de ação concluída — uso funcional, FR-008).
  success: 'bg-mg-surface border-l-4 border-mg-green text-mg-text',
  error: 'bg-mg-surface border-l-4 border-mg-text-negative text-mg-text',
  info: 'bg-mg-surface border-l-4 border-mg-text-announcement text-mg-text',
}

const TYPE_ICON_COLOR: Record<ToastType, string> = {
  success: 'text-mg-green',
  error: 'text-mg-text-negative',
  info: 'text-mg-text-announcement',
}

const TYPE_ICONS: Record<ToastType, IconName> = {
  success: 'CircleCheck',
  error: 'CircleAlert',
  info: 'Info',
}

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-center gap-3 rounded-card px-4 py-3 shadow-mg-dialog',
        TYPE_CLASSES[toast.type],
      )}
    >
      <Icon
        name={TYPE_ICONS[toast.type]}
        size={20}
        className={TYPE_ICON_COLOR[toast.type]}
      />
      <span className="flex-grow text-sm">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fechar notificação"
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
          'text-mg-text-muted hover:text-mg-text hover:bg-mg-surface-2/60',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2',
        )}
      >
        <Icon name="X" size={16} aria-hidden />
      </button>
    </div>
  )
}

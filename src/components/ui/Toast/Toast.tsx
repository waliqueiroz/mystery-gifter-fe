'use client'

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
  success: 'bg-success',
  error: 'bg-danger',
  info: 'bg-info',
}

const TYPE_ICONS: Record<ToastType, string> = {
  success: 'fas fa-check-circle',
  error: 'fas fa-exclamation-circle',
  info: 'fas fa-info-circle',
}

export function Toast({ toast, onDismiss }: ToastProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`mg-toast ${TYPE_CLASSES[toast.type]} text-white`}
    >
      <div className="d-flex align-items-center gap-2">
        <i className={TYPE_ICONS[toast.type]} aria-hidden="true" />
        <span className="flex-grow-1">{toast.message}</span>
        <button
          type="button"
          className="close text-white ml-2"
          aria-label="Fechar notificação"
          onClick={() => onDismiss(toast.id)}
        >
          <i className="fas fa-times" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

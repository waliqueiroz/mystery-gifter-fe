'use client'

interface ConfirmModalProps {
  isOpen: boolean
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="modal d-block"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmação"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ backgroundColor: 'var(--mg-bg-card)', color: 'var(--mg-text)', border: 'none' }}>
          <div className="modal-body py-4 px-4">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

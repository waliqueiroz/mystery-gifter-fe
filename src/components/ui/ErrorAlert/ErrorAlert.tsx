interface ErrorAlertProps {
  message: string
  onRetry: () => void
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div
      className="alert"
      role="alert"
      style={{
        backgroundColor: 'rgba(252,129,129,0.1)',
        border: '1px solid var(--mg-error)',
        color: 'var(--mg-error)',
      }}
    >
      <p className="mb-2">{message}</p>
      <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  )
}

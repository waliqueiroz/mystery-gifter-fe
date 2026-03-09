interface ButtonProps {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}${className ? ` ${className}` : ''}`}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm mr-2"
            role="status"
            aria-label="Carregando"
          />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}

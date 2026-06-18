import { cn } from '@/lib/cn'

export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'search'

interface FormFieldProps {
  id: string
  label: string
  type?: FormFieldType
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /**
   * Mensagem de erro em pt-BR. Quando presente, aplica borda e texto em
   * `mg.text-negative` e expõe `aria-invalid` + `aria-describedby`.
   */
  error?: string
  /**
   * Texto auxiliar mostrado abaixo do input quando não há erro.
   */
  helperText?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode']
}

/**
 * Input pill com inset shadow do DESIGN.md §4 (search input pattern).
 * Sem variações de cor — sempre escuro, sempre arredondado pill-lg.
 *
 * O `onChange` recebe direto o valor da string (não o evento), simplificando
 * o uso no consumidor: `onChange={setEmail}` em vez de wrapper de evento.
 */
export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required,
  disabled,
  autoComplete,
  inputMode,
}: FormFieldProps) {
  const helperId = `${id}-help`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : helperText ? helperId : undefined

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-mg-text-muted"
        >
          {label}
        </label>
        {required && (
          <span className="text-mg-text-negative" aria-hidden="true">
            *
          </span>
        )}
      </div>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'h-12 w-full rounded-pill-lg bg-mg-surface-2 px-5 text-base text-mg-text',
          'placeholder:text-mg-text-muted',
          'shadow-mg-inset',
          'focus:outline-none focus-visible:outline-2 focus-visible:outline focus-visible:outline-mg-green focus-visible:outline-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
          error && 'border border-mg-text-negative',
        )}
      />

      {error && (
        <p id={errorId} className="text-xs text-mg-text-negative">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-xs text-mg-text-muted">
          {helperText}
        </p>
      )}
    </div>
  )
}

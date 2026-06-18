import { Icon } from '@/components/ui/Icon/Icon'
import { cn } from '@/lib/cn'

interface ErrorAlertProps {
  message: string
  /**
   * Quando presente, renderiza um botão "Tentar novamente" inline ao alerta.
   *
   * Nota de contrato (ver `contracts/ui-primitives.md` §2b): o uso canônico
   * de ErrorAlert é **erro inline em formulário** (falha de submit, mensagem
   * de validação contextual). Para "falha ao carregar uma seção inteira",
   * a primitiva correta é `<EmptyState variant="error" cta={{...}} />`. O
   * `onRetry` permanece opcional para suportar casos onde o componente cabe
   * no fluxo (raros após a migração para EmptyState em todas as seções).
   */
  onRetry?: () => void
  className?: string
}

export function ErrorAlert({ message, onRetry, className }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col gap-2 rounded-card border border-mg-text-negative',
        'bg-mg-text-negative/10 px-4 py-3 text-mg-text-negative',
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Icon name="CircleAlert" size={18} className="mt-0.5 shrink-0" />
        <p className="flex-grow text-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'self-start rounded-pill border border-mg-text-negative px-3 py-1 text-xs font-semibold uppercase tracking-btn',
            'hover:bg-mg-text-negative/20',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-mg-green focus-visible:outline-offset-2',
          )}
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}

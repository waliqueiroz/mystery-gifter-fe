import Link from 'next/link'

import Button from '@/components/ui/Button/Button'
import { cn } from '@/lib/cn'

export type EmptyStateVariant = 'default' | 'error'

interface EmptyStateCta {
  label: string
  onClick?: () => void
  /**
   * Quando `href` for fornecido, o CTA renderiza um <Link> do Next.js em vez
   * de <button>. Útil para "Criar grupo" → `/groups/new`.
   */
  href?: string
}

interface EmptyStateProps {
  variant?: EmptyStateVariant
  /**
   * Ícone obrigatório (FR-025): em geral um `<Icon name="..." />`. O
   * `EmptyState` aplica a cor da variante via wrapper — não passar cor no
   * próprio ícone.
   */
  icon: React.ReactNode
  /**
   * Mensagem curta em pt-BR descrevendo o que está vazio (ou falhou).
   */
  title: string
  description?: string
  cta?: EmptyStateCta
  className?: string
}

/**
 * Primitiva única para representar estado vazio (lista sem itens, busca sem
 * resultados, etc.) E estado de erro de seção (variant='error', tipicamente
 * com CTA "Tentar novamente").
 *
 * Substitui variações ad-hoc por tela (FR-025).
 *
 * Quando `cta.href` é passado, o CTA renderiza como `<Link>` do Next; caso
 * contrário, como `<button>` com `onClick`. Sem `cta`, o EmptyState mostra
 * apenas ícone + texto — útil quando o contexto não comporta uma ação.
 */
export function EmptyState({
  variant = 'default',
  icon,
  title,
  description,
  cta,
  className,
}: EmptyStateProps) {
  const isError = variant === 'error'

  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center gap-4 px-6 py-12 text-center',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full',
          isError
            ? 'bg-mg-text-negative/10 text-mg-text-negative'
            : 'bg-mg-surface-2 text-mg-text-muted',
        )}
      >
        {icon}
      </div>

      <div className="flex flex-col gap-1">
        <h3
          className={cn(
            'text-lg font-bold',
            isError ? 'text-mg-text-negative' : 'text-mg-text',
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-mg-text-muted">{description}</p>
        )}
      </div>

      {cta && (cta.href ? (
        <Link href={cta.href} className="contents">
          <Button variant="primary" shape="pill-lg" size="md">
            {cta.label}
          </Button>
        </Link>
      ) : (
        <Button
          variant="primary"
          shape="pill-lg"
          size="md"
          onClick={cta.onClick}
        >
          {cta.label}
        </Button>
      ))}
    </div>
  )
}

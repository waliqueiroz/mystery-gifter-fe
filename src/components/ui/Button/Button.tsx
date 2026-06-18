import { SkeletonText } from '@/components/ui/Skeleton/SkeletonText'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonShape = 'pill' | 'pill-lg' | 'circle'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  shape?: ButtonShape
  size?: ButtonSize
  /**
   * Aplica `uppercase` + `tracking-btn` aos rótulos — padrão de "label
   * sistemático" do DESIGN.md §3 / FR-010. Default true para botões de ação.
   * Botões circulares ignoram este flag (não há texto).
   */
  uppercase?: boolean
  /**
   * Durante uma submissão assíncrona substitui o conteúdo por um
   * <SkeletonText> com a largura do rótulo, jamais por spinner (FR-024).
   * `aria-busy` é exposto para leitores de tela.
   */
  loading?: boolean
  disabled?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  title?: string
  'aria-label'?: string
}

/* Tabela de variantes — referência rápida do DESIGN.md §4 + Style Guide. */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  // CTA principal — verde funcional sobre texto preto (FR-008)
  primary:
    'bg-mg-green text-black hover:brightness-110 disabled:hover:brightness-100',
  // Botão secundário em superfície escura
  secondary:
    'bg-mg-surface-2 text-mg-text hover:bg-mg-surface-3 disabled:hover:bg-mg-surface-2',
  // Outlined — borda muted, texto branco; usado em follow buttons
  outline:
    'bg-transparent text-mg-text border border-mg-border-light hover:border-mg-text hover:bg-mg-surface-2/40 disabled:hover:bg-transparent',
  // Botão de menor peso visual; sem fundo, sem borda
  ghost:
    'bg-transparent text-mg-text-muted hover:text-mg-text hover:bg-mg-surface-2/40 disabled:hover:bg-transparent',
}

const SHAPE_CLASSES: Record<ButtonShape, string> = {
  pill: 'rounded-pill',
  'pill-lg': 'rounded-pill-lg',
  circle: 'rounded-full aspect-square p-0',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

const SIZE_CIRCLE: Record<ButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  shape = 'pill-lg',
  size = 'md',
  uppercase = true,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  onClick,
  className,
  title,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const isCircle = shape === 'circle'
  const isInactive = disabled || loading

  return (
    <button
      type={type}
      onClick={isInactive ? undefined : onClick}
      disabled={isInactive}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      title={title}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mg-green',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT_CLASSES[variant],
        SHAPE_CLASSES[shape],
        isCircle ? SIZE_CIRCLE[size] : SIZE_CLASSES[size],
        uppercase && !isCircle && 'uppercase tracking-btn',
        className,
      )}
    >
      {loading ? (
        <SkeletonText width="60%" />
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
        </>
      )}
    </button>
  )
}

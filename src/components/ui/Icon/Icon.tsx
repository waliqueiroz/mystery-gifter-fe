import { icons, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'

export type IconName = keyof typeof icons

interface IconProps {
  name: IconName
  size?: number
  className?: string
  /**
   * Por padrão um ícone é decorativo (acompanha um texto que já carrega o
   * significado) e fica invisível para leitores de tela. Quando o ícone for o
   * único conteúdo do controle (ex.: botão circular), passe `aria-label` e
   * defina `aria-hidden={false}`.
   */
  'aria-hidden'?: boolean
  'aria-label'?: string
}

/**
 * Wrapper de `lucide-react` que padroniza tamanho, cor herdada e a11y.
 *
 * Defaults:
 *  - `size=20` (≈ corpo de botão padrão do DESIGN.md §4)
 *  - `aria-hidden=true` — assume decorativo. Para ícones funcionais sem texto
 *    visível, sobrescreva explicitamente.
 *
 * A cor SEMPRE herda do contexto (`currentColor`). Isso preserva a regra de
 * que verde de marca (`mg.green`) só aparece em controles funcionais — o
 * Icon não impõe cor própria.
 */
export function Icon({
  name,
  size = 20,
  className,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
}: IconProps) {
  const LucideComponent: LucideIcon = icons[name]
  return (
    <LucideComponent
      size={size}
      className={cn('shrink-0', className)}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      focusable={false}
    />
  )
}

import Skeleton from 'react-loading-skeleton'

interface SkeletonBoxProps {
  width?: number | string
  height?: number | string
  className?: string
  /**
   * Raio do box (números viram px). Default 6 — alinhado a `rounded-card-sm`
   * do tema (DESIGN.md §5).
   */
  borderRadius?: number | string
}

/**
 * Placeholder retangular do design system. Usar enquanto um bloco de conteúdo
 * de forma definida (cartão, painel, lista) está carregando.
 *
 * O tema do shimmer já vem do <SkeletonProvider> envolvente — não passar
 * cores aqui (preserva consistência visual em toda a árvore).
 */
export function SkeletonBox({
  width,
  height = 16,
  className,
  borderRadius = 6,
}: SkeletonBoxProps) {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius={borderRadius}
      containerClassName={className}
      data-testid="skeleton-box"
    />
  )
}

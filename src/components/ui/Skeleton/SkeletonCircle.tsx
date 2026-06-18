import Skeleton from 'react-loading-skeleton'

interface SkeletonCircleProps {
  size: number
  className?: string
}

/**
 * Placeholder circular — usar para avatar, ícone de botão de play e qualquer
 * elemento que vai aparecer com border-radius 50% após o load (FR-009 +
 * DESIGN.md §5).
 */
export function SkeletonCircle({ size, className }: SkeletonCircleProps) {
  return (
    <Skeleton
      width={size}
      height={size}
      circle
      containerClassName={className}
      data-testid="skeleton-circle"
    />
  )
}

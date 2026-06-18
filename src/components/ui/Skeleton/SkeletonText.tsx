import Skeleton from 'react-loading-skeleton'

interface SkeletonTextProps {
  /**
   * Número de linhas. Default 1.
   */
  lines?: number
  /**
   * Largura única (string) aplicada a todas as linhas, OU array de larguras
   * onde cada índice define uma linha individualmente. Útil para criar o
   * efeito "última linha mais curta" típico de parágrafo.
   */
  width?: string | string[]
  className?: string
}

/**
 * Placeholder para texto carregando — uma ou mais linhas finas com a
 * altura tipográfica do corpo do tema. Para blocos retangulares maiores
 * (cartão, imagem) usar SkeletonBox; para avatares, SkeletonCircle.
 */
export function SkeletonText({
  lines = 1,
  width,
  className,
}: SkeletonTextProps) {
  if (lines === 1) {
    const singleWidth = Array.isArray(width) ? width[0] : width
    return (
      <Skeleton
        height={14}
        width={singleWidth}
        borderRadius={4}
        containerClassName={className}
        data-testid="skeleton-text"
      />
    )
  }

  const widths: (string | undefined)[] = Array.isArray(width)
    ? width
    : Array.from({ length: lines }, () => width)

  return (
    <span className={className} data-testid="skeleton-text-multi">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={14}
          width={widths[index]}
          borderRadius={4}
          data-testid="skeleton-text"
        />
      ))}
    </span>
  )
}

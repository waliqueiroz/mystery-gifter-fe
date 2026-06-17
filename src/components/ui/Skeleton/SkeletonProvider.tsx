'use client'

import { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface SkeletonProviderProps {
  children: React.ReactNode
}

/**
 * Configura o tema global do react-loading-skeleton com a paleta near-black
 * do DESIGN.md (baseColor mg-surface-2 / highlightColor mg-surface-4).
 *
 * Envolve a árvore das áreas autenticadas e públicas para que qualquer
 * `<Skeleton />` herde o estilo correto sem prop drilling. A animação shimmer
 * default do react-loading-skeleton é silenciada automaticamente pelo
 * `@media (prefers-reduced-motion: reduce)` em globals.css (FR-013).
 *
 * Use este provider — NÃO instancie `<SkeletonTheme>` manualmente em outras
 * camadas, para não criar variações fora do design system.
 */
export function SkeletonProvider({ children }: SkeletonProviderProps) {
  return (
    <SkeletonTheme baseColor="#1f1f1f" highlightColor="#272727">
      {children}
    </SkeletonTheme>
  )
}

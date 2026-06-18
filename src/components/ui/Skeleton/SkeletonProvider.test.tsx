import { render, screen } from '@testing-library/react'
import Skeleton from 'react-loading-skeleton'
import { SkeletonProvider } from './SkeletonProvider'

describe('SkeletonProvider', () => {
  it('renderiza children', () => {
    render(
      <SkeletonProvider>
        <p>conteudo</p>
      </SkeletonProvider>,
    )
    expect(screen.getByText('conteudo')).toBeInTheDocument()
  })

  it('aplica baseColor mg-surface-2 (#1f1f1f) em Skeleton descendente', () => {
    const { container } = render(
      <SkeletonProvider>
        <Skeleton data-testid="sk" />
      </SkeletonProvider>,
    )

    const span = container.querySelector('.react-loading-skeleton')
    expect(span).not.toBeNull()
    const inlineStyle = (span as HTMLElement | null)?.getAttribute('style') ?? ''
    expect(inlineStyle).toContain('--base-color')
    expect(inlineStyle.toLowerCase()).toContain('#1f1f1f')
  })

  it('aplica highlightColor mg-surface-4 (#272727) em Skeleton descendente', () => {
    const { container } = render(
      <SkeletonProvider>
        <Skeleton />
      </SkeletonProvider>,
    )

    const span = container.querySelector('.react-loading-skeleton')
    const inlineStyle = (span as HTMLElement | null)?.getAttribute('style') ?? ''
    expect(inlineStyle).toContain('--highlight-color')
    expect(inlineStyle.toLowerCase()).toContain('#272727')
  })
})

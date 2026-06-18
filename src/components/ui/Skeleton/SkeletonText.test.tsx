import { render, screen } from '@testing-library/react'

import { SkeletonText } from './SkeletonText'

describe('SkeletonText', () => {
  it('renderiza uma única linha por padrão', () => {
    render(<SkeletonText />)
    const skels = document.querySelectorAll('.react-loading-skeleton')
    expect(skels.length).toBe(1)
  })

  it('aplica altura tipográfica de 14px na linha', () => {
    render(<SkeletonText />)
    const skel = document.querySelector('.react-loading-skeleton')!
    expect((skel as HTMLElement).style.height).toBe('14px')
  })

  it('renderiza N linhas quando lines=N', () => {
    render(<SkeletonText lines={3} />)
    const skels = document.querySelectorAll('.react-loading-skeleton')
    expect(skels.length).toBe(3)
  })

  it('aplica largura única (string) em todas as linhas', () => {
    render(<SkeletonText lines={2} width="80%" />)
    const skels = document.querySelectorAll('.react-loading-skeleton')
    skels.forEach((skel) => {
      expect((skel as HTMLElement).style.width).toBe('80%')
    })
  })

  it('aplica larguras independentes quando width é array', () => {
    render(<SkeletonText lines={3} width={['100%', '90%', '60%']} />)
    const skels = document.querySelectorAll('.react-loading-skeleton')
    expect((skels[0] as HTMLElement).style.width).toBe('100%')
    expect((skels[1] as HTMLElement).style.width).toBe('90%')
    expect((skels[2] as HTMLElement).style.width).toBe('60%')
  })

  it('renderiza container <span> distinto quando multi-linha', () => {
    render(<SkeletonText lines={2} />)
    expect(screen.getByTestId('skeleton-text-multi')).toBeInTheDocument()
  })

  it('encaminha className em modo single-linha', () => {
    render(<SkeletonText className="mt-4" />)
    const inner = document.querySelector('.react-loading-skeleton')!
    expect(inner.parentElement?.getAttribute('class')).toContain('mt-4')
  })
})

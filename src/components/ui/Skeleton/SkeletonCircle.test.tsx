import { render } from '@testing-library/react'

import { SkeletonCircle } from './SkeletonCircle'

describe('SkeletonCircle', () => {
  it('renderiza um skeleton com width e height iguais', () => {
    render(<SkeletonCircle size={40} />)
    const skel = document.querySelector('.react-loading-skeleton')!
    expect((skel as HTMLElement).style.width).toBe('40px')
    expect((skel as HTMLElement).style.height).toBe('40px')
  })

  it('aplica borderRadius circular (50% via prop circle)', () => {
    render(<SkeletonCircle size={32} />)
    const skel = document.querySelector('.react-loading-skeleton')!
    expect((skel as HTMLElement).style.borderRadius).toBe('50%')
  })

  it('encaminha className para o container externo', () => {
    render(<SkeletonCircle size={24} className="inline-block" />)
    const inner = document.querySelector('.react-loading-skeleton')!
    expect(inner.parentElement?.getAttribute('class')).toContain('inline-block')
  })
})

import { render, screen } from '@testing-library/react'

import { SkeletonBox } from './SkeletonBox'

describe('SkeletonBox', () => {
  it('renderiza um skeleton com altura padrão 16px', () => {
    render(<SkeletonBox />)
    const skel = document.querySelector('.react-loading-skeleton')
    expect(skel).not.toBeNull()
    expect((skel as HTMLElement).style.height).toBe('16px')
  })

  it('aplica largura e altura customizadas em px quando number', () => {
    render(<SkeletonBox width={120} height={48} />)
    const skel = document.querySelector('.react-loading-skeleton')!
    expect((skel as HTMLElement).style.width).toBe('120px')
    expect((skel as HTMLElement).style.height).toBe('48px')
  })

  it('aceita string como largura (ex.: 50%)', () => {
    render(<SkeletonBox width="50%" />)
    const skel = document.querySelector('.react-loading-skeleton')!
    expect((skel as HTMLElement).style.width).toBe('50%')
  })

  it('aplica borderRadius default 6px', () => {
    render(<SkeletonBox />)
    const skel = document.querySelector('.react-loading-skeleton')!
    expect((skel as HTMLElement).style.borderRadius).toBe('6px')
  })

  it('aplica borderRadius customizado', () => {
    render(<SkeletonBox borderRadius={8} />)
    const skel = document.querySelector('.react-loading-skeleton')!
    expect((skel as HTMLElement).style.borderRadius).toBe('8px')
  })

  it('encaminha className para o container externo do react-loading-skeleton', () => {
    render(<SkeletonBox className="my-2 block" />)
    const inner = document.querySelector('.react-loading-skeleton')!
    const container = inner.parentElement
    expect(container?.getAttribute('class')).toContain('my-2')
    expect(container?.getAttribute('class')).toContain('block')
  })
})

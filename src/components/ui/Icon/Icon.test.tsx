import { render } from '@testing-library/react'

import { Icon } from './Icon'

describe('Icon', () => {
  it('renders the requested icon from lucide-react', () => {
    const { container } = render(<Icon name="X" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
  })

  it('applies default size 20', () => {
    const { container } = render(<Icon name="X" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('20')
    expect(svg.getAttribute('height')).toBe('20')
  })

  it('applies custom size', () => {
    const { container } = render(<Icon name="X" size={32} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('32')
    expect(svg.getAttribute('height')).toBe('32')
  })

  it('is decorative by default (aria-hidden=true, no aria-label)', () => {
    const { container } = render(<Icon name="X" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('aria-hidden')).toBe('true')
    expect(svg.getAttribute('aria-label')).toBeNull()
  })

  it('exposes aria-label when passed and aria-hidden=false', () => {
    const { container } = render(
      <Icon name="X" aria-hidden={false} aria-label="Fechar" />,
    )
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('aria-hidden')).toBe('false')
    expect(svg.getAttribute('aria-label')).toBe('Fechar')
  })

  it('composes additional className with the default shrink-0', () => {
    const { container } = render(<Icon name="X" className="text-mg-green" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('class')).toContain('shrink-0')
    expect(svg.getAttribute('class')).toContain('text-mg-green')
  })

  it('marks focusable=false to not capture tab natively', () => {
    const { container } = render(<Icon name="X" />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('focusable')).toBe('false')
  })
})
